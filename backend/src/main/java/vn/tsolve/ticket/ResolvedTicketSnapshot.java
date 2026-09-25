package vn.tsolve.ticket;

import jakarta.persistence.*;
import java.time.Instant;

/** Snapshot/reference of a ticket owned by an external tracker. T-Solve never owns the ticket lifecycle. */
@Entity
@Table(name = "resolved_ticket_snapshot")
public class ResolvedTicketSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "workspace_id", nullable = false)
    private Long workspaceId;

    @Column(nullable = false)
    private String source;

    @Column(name = "external_id", nullable = false)
    private String externalId;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "ticket_type")
    private String ticketType;

    private String category;

    @Column(name = "source_status")
    private String sourceStatus;

    @Column(columnDefinition = "text")
    private String resolution;

    private String resolver;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "imported_at", nullable = false, updatable = false)
    private Instant importedAt = Instant.now();

    protected ResolvedTicketSnapshot() {}

    public ResolvedTicketSnapshot(Long workspaceId, String source, String externalId) {
        this.workspaceId = workspaceId;
        this.source = source;
        this.externalId = externalId;
    }

    /** Overwrites the snapshot content from a (re-)import; identity fields stay unchanged. */
    public void update(ImportTicketRequest r) {
        this.sourceUrl = r.sourceUrl();
        this.title = r.title();
        this.description = r.description();
        this.ticketType = r.ticketType();
        this.category = r.category();
        this.sourceStatus = r.sourceStatus();
        this.resolution = r.resolution();
        this.resolver = r.resolver();
        this.resolvedAt = r.resolvedAt();
    }

    public Long getId() { return id; }
    public Long getWorkspaceId() { return workspaceId; }
    public String getSource() { return source; }
    public String getExternalId() { return externalId; }
    public String getSourceUrl() { return sourceUrl; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getTicketType() { return ticketType; }
    public String getCategory() { return category; }
    public String getSourceStatus() { return sourceStatus; }
    public String getResolution() { return resolution; }
    public String getResolver() { return resolver; }
    public Instant getResolvedAt() { return resolvedAt; }
    public Instant getImportedAt() { return importedAt; }
}
