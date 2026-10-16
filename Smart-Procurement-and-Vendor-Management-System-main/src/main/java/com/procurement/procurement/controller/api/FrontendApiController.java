package com.procurement.procurement.controller.api;

import com.procurement.procurement.entity.procurement.*;
import com.procurement.procurement.entity.user.User;
import com.procurement.procurement.entity.vendor.Vendor;
import com.procurement.procurement.repository.user.UserRepository;
import com.procurement.procurement.service.procurement.ApprovalService;
import com.procurement.procurement.service.procurement.PurchaseOrderService;
import com.procurement.procurement.service.procurement.RequisitionService;
import com.procurement.procurement.service.vendor.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Flat JSON endpoints for the React UI. Entities are converted to plain maps so the
 * response has no circular references (Requisition <-> Item <-> Approval ...).
 */
@RestController
@RequestMapping("/api/v1")
public class FrontendApiController {

    public record ItemIn(String itemName, String description, Integer quantity, Double unitPrice) {}
    public record RequisitionIn(String requisitionNumber, List<ItemIn> items) {}
    public record PurchaseOrderIn(String poNumber, Long vendorId, List<ItemIn> items) {}
    public record DecisionIn(String status, String comments) {}

    private final VendorService vendorService;
    private final RequisitionService requisitionService;
    private final PurchaseOrderService purchaseOrderService;
    private final ApprovalService approvalService;
    private final UserRepository userRepository;

    public FrontendApiController(VendorService vendorService, RequisitionService requisitionService,
                                 PurchaseOrderService purchaseOrderService, ApprovalService approvalService,
                                 UserRepository userRepository) {
        this.vendorService = vendorService;
        this.requisitionService = requisitionService;
        this.purchaseOrderService = purchaseOrderService;
        this.approvalService = approvalService;
        this.userRepository = userRepository;
    }

    // ---------------------------------------------------------------- dashboard
    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(Authentication auth) {
        List<Requisition> reqs = visibleRequisitions(auth);
        List<PurchaseOrder> pos = purchaseOrderService.getAllPurchaseOrders();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("vendors", vendorService.getAllVendors().size());
        m.put("requisitions", reqs.size());
        m.put("purchaseOrders", pos.size());
        m.put("pendingApprovals", approvalService.getAllApprovals().stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count());
        m.put("requisitionStatus", reqs.stream().collect(
                Collectors.groupingBy(r -> String.valueOf(r.getStatus()), TreeMap::new, Collectors.counting())));
        m.put("poStatus", pos.stream().collect(
                Collectors.groupingBy(p -> String.valueOf(p.getStatus()), TreeMap::new, Collectors.counting())));
        return m;
    }

    // ------------------------------------------------------------- requisitions
    @GetMapping("/requisitions")
    public List<Map<String, Object>> requisitions(Authentication auth) {
        return visibleRequisitions(auth).stream()
                .sorted(Comparator.comparing(Requisition::getId).reversed())
                .map(this::toMap).collect(Collectors.toList());
    }

    @PostMapping("/requisitions")
    public Map<String, Object> createRequisition(@RequestBody RequisitionIn in) {
        Requisition r = new Requisition();
        r.setRequisitionNumber(in.requisitionNumber());
        List<RequisitionItem> items = new ArrayList<>();
        for (ItemIn i : safe(in.items())) {
            RequisitionItem it = new RequisitionItem();
            it.setItemName(i.itemName());
            it.setDescription(i.description() == null ? "" : i.description());
            it.setQuantity(i.quantity() == null || i.quantity() < 1 ? 1 : i.quantity());
            it.setUnitPrice(i.unitPrice() == null ? 0 : i.unitPrice());
            it.setRequisition(r);
            items.add(it);
        }
        r.setItems(items);
        // service sets requestedBy from the logged-in user and auto-creates the approval
        return toMap(requisitionService.createRequisition(r));
    }

    // ----------------------------------------------------------- purchase orders
    @GetMapping("/purchase-orders")
    public List<Map<String, Object>> purchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders().stream()
                .sorted(Comparator.comparing(PurchaseOrder::getId).reversed())
                .map(this::toMap).collect(Collectors.toList());
    }

    @PostMapping("/purchase-orders")
    public Map<String, Object> createPurchaseOrder(@RequestBody PurchaseOrderIn in) {
        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber(in.poNumber());
        po.setStatus("PENDING");
        Vendor vendor = vendorService.getVendorById(in.vendorId());
        po.setVendor(vendor);
        List<PurchaseOrderItem> items = new ArrayList<>();
        for (ItemIn i : safe(in.items())) {
            PurchaseOrderItem it = new PurchaseOrderItem();
            it.setItemName(i.itemName());
            it.setQuantity(i.quantity() == null || i.quantity() < 1 ? 1 : i.quantity());
            it.setUnitPrice(i.unitPrice() == null ? 0.0 : i.unitPrice());
            it.setPurchaseOrder(po);
            items.add(it);
        }
        po.setItems(items);
        PurchaseOrder saved = purchaseOrderService.createPurchaseOrder(po);

        Approval approval = new Approval();           // goes to the Approval Center
        approval.setPurchaseOrder(saved);
        approvalService.createApproval(approval);
        return toMap(saved);
    }

    // ---------------------------------------------------------------- approvals
    @GetMapping("/approvals")
    public List<Map<String, Object>> approvals() {
        return approvalService.getAllApprovals().stream()
                .sorted(Comparator.comparing(Approval::getId).reversed())
                .map(a -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", a.getId());
                    m.put("status", a.getStatus());
                    m.put("comments", a.getComments());
                    m.put("approver", a.getApprover() == null ? null : a.getApprover().getUsername());
                    m.put("decidedAt", a.getApprovedAt() == null ? null : a.getApprovedAt().toString());
                    if (a.getPurchaseOrder() != null) {
                        PurchaseOrder p = a.getPurchaseOrder();
                        m.put("type", "PURCHASE_ORDER");
                        m.put("reference", p.getPoNumber());
                        m.put("details", p.getVendor() == null ? null : "Vendor: " + p.getVendor().getName());
                        m.put("amount", poTotal(p));
                    } else if (a.getRequisition() != null) {
                        Requisition r = a.getRequisition();
                        m.put("type", "REQUISITION");
                        m.put("reference", r.getRequisitionNumber());
                        m.put("details", r.getRequestedBy() == null ? null : "By: " + r.getRequestedBy().getUsername());
                        m.put("amount", reqTotal(r));
                    } else {
                        m.put("type", "UNKNOWN"); m.put("reference", "#" + a.getId()); m.put("amount", 0);
                    }
                    return m;
                }).collect(Collectors.toList());
    }

    @PostMapping("/approvals/{id}/decision")
    public ResponseEntity<?> decide(@PathVariable Long id, @RequestBody DecisionIn in, Authentication auth) {
        String status = in.status() == null ? "" : in.status().toUpperCase();
        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status must be APPROVED or REJECTED"));
        }
        User approver = userRepository.findByUsername(auth.getName()).orElse(null);
        approvalService.updateApprovalStatus(id, status, in.comments(), approver);
        return ResponseEntity.ok(Map.of("message", "Decision saved"));
    }

    // ------------------------------------------------------------------ helpers
    private List<Requisition> visibleRequisitions(Authentication auth) {
        boolean employee = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));
        return employee ? requisitionService.getMyRequisitions() : requisitionService.getAllRequisitions();
    }

    private static <T> List<T> safe(List<T> l) { return l == null ? List.of() : l; }

    private double reqTotal(Requisition r) {
        return safe(r.getItems()).stream().mapToDouble(i -> i.getQuantity() * i.getUnitPrice()).sum();
    }

    private double poTotal(PurchaseOrder p) {
        return safe(p.getItems()).stream()
                .mapToDouble(i -> (i.getQuantity() == null ? 0 : i.getQuantity()) * (i.getUnitPrice() == null ? 0 : i.getUnitPrice()))
                .sum();
    }

    private Map<String, Object> toMap(Requisition r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("requisitionNumber", r.getRequisitionNumber());
        m.put("status", r.getStatus());
        m.put("createdAt", r.getCreatedAt() == null ? null : r.getCreatedAt().toString());
        m.put("requestedBy", r.getRequestedBy() == null ? null : r.getRequestedBy().getUsername());
        m.put("total", reqTotal(r));
        m.put("items", safe(r.getItems()).stream().map(i -> {
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("id", i.getId()); x.put("itemName", i.getItemName()); x.put("description", i.getDescription());
            x.put("quantity", i.getQuantity()); x.put("unitPrice", i.getUnitPrice());
            return x;
        }).collect(Collectors.toList()));
        return m;
    }

    private Map<String, Object> toMap(PurchaseOrder p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("poNumber", p.getPoNumber());
        m.put("status", p.getStatus());
        m.put("createdAt", p.getCreatedAt() == null ? null : p.getCreatedAt().toString());
        m.put("vendor", p.getVendor() == null ? null : p.getVendor().getName());
        m.put("total", poTotal(p));
        m.put("items", safe(p.getItems()).stream().map(i -> {
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("id", i.getId()); x.put("itemName", i.getItemName());
            x.put("quantity", i.getQuantity()); x.put("unitPrice", i.getUnitPrice());
            return x;
        }).collect(Collectors.toList()));
        return m;
    }
}
