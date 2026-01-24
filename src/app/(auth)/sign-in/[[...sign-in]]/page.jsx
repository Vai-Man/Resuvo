import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20 px-4">
      <SignIn
        appearance={{
          elements: {
            // Layout
            rootBox: "w-full max-w-md",
            card: "bg-card backdrop-blur-md shadow-xl border border-border p-8",
            headerTitle: "text-2xl font-semibold text-foreground mb-2",
            headerSubtitle: "text-muted-foreground mb-4",
            footerActionText: "text-muted-foreground",
            footerActionLink:
              "text-primary hover:text-primary/80 font-medium transition-colors",

            // Form elements
            formFieldLabel: "text-foreground font-medium mb-2",
            formFieldInput:
              "bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all",
            formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",

            // Main sign-in button
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-lg py-2.5 font-medium shadow-sm",

            // Social buttons - Updated for dark mode
            socialButtonsBlockButton:
              "flex items-center justify-center gap-3 rounded-lg border border-border transition-colors duration-200 py-2.5 font-medium",
            socialButtonsBlockButton__google:
              "bg-white text-black hover:bg-gray-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
            socialButtonsBlockButton__github:
              "bg-black text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600",
            socialButtonsBlockButtonText: "font-medium tracking-tight",
            socialButtonsProviderIcon: "w-5 h-5",

            // Divider
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground text-sm",

            // Links and additional elements
            identityPreviewText: "text-foreground",
            identityPreviewEditButton: "text-primary hover:text-primary/80",
            formResendCodeLink: "text-primary hover:text-primary/80",
            otpCodeFieldInput: "bg-input border-border text-foreground rounded-lg focus:ring-2 focus:ring-ring",
            formFieldSuccessText: "text-chart-2",
            formFieldErrorText: "text-destructive",
            alertText: "text-foreground",
          },
          variables: {
            colorPrimary: "oklch(0.6723 0.1606 244.9955)",
            colorText: "oklch(0.1884 0.0128 248.5103)",
            colorBackground: "oklch(0.9784 0.0011 197.1387)",
            colorInputBackground: "oklch(0.9809 0.0025 228.7836)",
            colorDanger: "oklch(0.6188 0.2376 25.7658)",
          },
        }}
      />
    </div>
  );
}