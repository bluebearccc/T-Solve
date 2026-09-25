package vn.tsolve.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record ImportTicketRequest(
        @NotNull Long workspaceId,
        @NotBlank String source,
        @NotBlank String externalId,
        String sourceUrl,
        @NotBlank String title,
        String description,
        String ticketType,
        String category,
        String sourceStatus,
        String resolution,
        String resolver,
        Instant resolvedAt) {
}
