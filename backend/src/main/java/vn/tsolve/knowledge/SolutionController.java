package vn.tsolve.knowledge;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solutions")
public class SolutionController {

    private final SolutionService service;

    public SolutionController(SolutionService service) {
        this.service = service;
    }

    /** Defaults to PUBLISHED solutions (the default reuse set). */
    @GetMapping
    public List<Solution> list(@RequestParam(required = false) SolutionStatus status) {
        return service.list(status);
    }

    @GetMapping("/{id}")
    public Solution get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Solution create(@Valid @RequestBody SolutionRequest request) {
        return service.createDraft(request);
    }

    @PutMapping("/{id}")
    public Solution update(@PathVariable Long id, @Valid @RequestBody SolutionRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/transition")
    public Solution transition(@PathVariable Long id, @RequestParam SolutionStatus to) {
        return service.transition(id, to);
    }
}
