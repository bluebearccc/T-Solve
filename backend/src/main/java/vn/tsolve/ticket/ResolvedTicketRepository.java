package vn.tsolve.ticket;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResolvedTicketRepository extends JpaRepository<ResolvedTicketSnapshot, Long> {
    Optional<ResolvedTicketSnapshot> findBySourceAndExternalId(String source, String externalId);
}
