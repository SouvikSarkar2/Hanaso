"use client";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex rounded-full border-[2px] border-black bg-transparent dark:border-[#FFFAE6]">
      <div
        onClick={() => setTheme("dark")}
        className={`${theme === "dark" ? "bg-[#FFFAE6] text-black" : ""} rounded-full px-2.5 py-2`}
      >
        <MoonStar size={18} />
      </div>
      <div
        onClick={() => setTheme("light")}
        className={`${theme === "light" ? "bg-black text-[#FFFAE6]" : ""} rounded-full px-2.5 py-2`}
      >
        <Sun size={18} />
      </div>
    </div>
  );
};

export default ThemeSwitch;
