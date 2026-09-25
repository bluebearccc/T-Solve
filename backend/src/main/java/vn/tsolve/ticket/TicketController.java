package vn.tsolve.ticket;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @GetMapping
    public List<ResolvedTicketSnapshot> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public ResolvedTicketSnapshot get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping("/import")
    public ResolvedTicketSnapshot importTicket(@Valid @RequestBody ImportTicketRequest request) {
        return service.importTicket(request);
    }
}
