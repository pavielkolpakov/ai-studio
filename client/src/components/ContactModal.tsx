import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitContact } from "@/api/contact";
import { openCalendlyPopup } from "@/lib/calendly";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "Name is required";
  else if (name.length > 200) errors.name = "Name is too long";

  if (!email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Invalid email address";

  if (!message.trim()) errors.message = "Message is required";
  else if (message.length > 5000) errors.message = "Message is too long (max 5000 characters)";

  return errors;
}

export function ContactModal({ open, onOpenChange, sessionId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSubmitted(false);
    setSending(false);
    setServerError(null);
    setSuccess(false);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) resetForm();
      onOpenChange(next);
    },
    [onOpenChange, resetForm]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);

    const fieldErrors = validate(name, email, message);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSending(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        session_id: sessionId,
      });
      setSuccess(true);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  // Re-validate on change after first submission attempt
  const updateField = (
    field: "name" | "email" | "message",
    value: string
  ) => {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setMessage(value);

    if (submitted) {
      const next = {
        name: field === "name" ? value : name,
        email: field === "email" ? value : email,
        message: field === "message" ? value : message,
      };
      setErrors(validate(next.name, next.email, next.message));
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message sent</DialogTitle>
            <DialogDescription>
              Thanks for reaching out! We'll get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Want to skip the wait?
            </p>
            <Button
              onClick={() => {
                openCalendlyPopup(sessionId);
              }}
              className="btn-primary w-full cursor-pointer border-0"
            >
              Book a Call
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="w-full cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Send us a message and we'll get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <div className="flex flex-col gap-1">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              placeholder="Your message"
              value={message}
              onChange={(e) => updateField("message", e.target.value)}
              rows={4}
              aria-invalid={!!errors.message}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-none"
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message}</p>
            )}
          </div>

          <Button type="submit" disabled={sending} className="w-full cursor-pointer">
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          onClick={() => openCalendlyPopup(sessionId)}
          className="w-full rounded-full border border-border bg-[#2f2f2f] text-foreground hover:bg-accent cursor-pointer transition-colors"
        >
          Book a Call
        </Button>
      </DialogContent>
    </Dialog>
  );
}
