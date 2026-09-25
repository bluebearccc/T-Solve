package vn.tsolve.common.error;

/** A well-formed request that violates a domain rule (e.g. illegal solution status transition). */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
