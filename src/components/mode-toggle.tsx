import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme === "dark" ? "light" : "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group rounded-full w-9 h-9 border border-border transition-colors duration-300"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rotate-0 scale-100 dark:-rotate-90 dark:-translate-y-2 dark:opacity-0" />
      <Moon className="absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rotate-90 translate-y-2 opacity-0 dark:rotate-0 dark:translate-y-0 dark:opacity-100 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
