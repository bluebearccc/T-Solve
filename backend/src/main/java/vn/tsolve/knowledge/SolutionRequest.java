package vn.tsolve.knowledge;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record SolutionRequest(
        @NotNull Long workspaceId,
        @NotBlank String title,
        String symptoms,
        String rootCause,
        String steps,
        String workaround,
        String applicability,
        Instant reviewDueAt) {
}
