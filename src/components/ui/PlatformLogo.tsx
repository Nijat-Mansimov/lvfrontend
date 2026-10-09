import React from 'react';

export interface PlatformLogoProps {
  platform: string;
  className?: string;
  size?: number;
}

export function PlatformLogo({ platform, className = 'w-4 h-4', size = 16 }: PlatformLogoProps) {
  const p = (platform || '').toLowerCase().trim();

  // VS Code
  if (p === 'vscode' || p === 'vs code' || p === 'visual_studio_code') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="VS Code"
      >
        <path
          d="M17.8 2.3L6.3 9.7L2.4 6.7L1 7.6V16.4L2.4 17.3L6.3 14.3L17.8 21.7C18.6 22.2 19.6 21.8 19.9 21L23 4.2C23.2 3.3 22.4 2.5 21.5 2.7L17.8 2.3Z"
          fill="#0065A9"
        />
        <path
          d="M17.8 2.3L7.7 10.9L2.4 6.7L1 7.6V16.4L2.4 17.3L7.7 13.1L17.8 21.7C18.6 22.2 19.6 21.8 19.9 21L23 4.2C23.2 3.3 22.4 2.5 21.5 2.7L17.8 2.3Z"
          fill="#007ACC"
        />
        <path
          d="M17.8 2.3L8.5 12L17.8 21.7C18.6 22.2 19.6 21.8 19.9 21L23 4.2C23.2 3.3 22.4 2.5 21.5 2.7L17.8 2.3Z"
          fill="#1F9CF0"
        />
        <path
          d="M6.3 9.7L1 7.6V16.4L6.3 14.3L8.5 12L6.3 9.7Z"
          fill="#0065A9"
        />
      </svg>
    );
  }

  // Google Chrome
  if (p === 'chrome' || p === 'chrome web store' || p === 'cws') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Google Chrome"
      >
        <circle cx="12" cy="12" r="10" fill="#EA4335" />
        <path
          d="M12 2C15.9 2 19.2 4.3 20.8 7.6L12 12L7.3 3.8C8.8 2.7 10.3 2 12 2Z"
          fill="#EA4335"
        />
        <path
          d="M20.8 7.6C21.6 8.9 22 10.4 22 12C22 16.8 18.6 20.9 14 21.8L9.5 14L12 12L20.8 7.6Z"
          fill="#FBBC05"
        />
        <path
          d="M14 21.8C13.3 21.9 12.7 22 12 22C6.5 22 2 17.5 2 12C2 10.1 2.5 8.3 3.4 6.8L7.3 13.5L9.5 14L14 21.8Z"
          fill="#34A853"
        />
        <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
      </svg>
    );
  }

  // Microsoft Edge
  if (p === 'edge' || p === 'edge add-ons') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Microsoft Edge"
      >
        <path
          d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 11.2 21.9 10.4 21.7 9.6C20.6 13.3 17.2 16 13.2 16C9.9 16 7.2 13.3 7.2 10C7.2 6.7 9.9 4 13.2 4C14.1 4 15 4.2 15.8 4.6C14.7 3 13 2 12 2Z"
          fill="#0078D7"
        />
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 11.2 21.9 10.4 21.7 9.6C21.4 12.4 19.3 14.5 16.5 14.5C13.5 14.5 11 12 11 9C11 6.5 12.7 4.5 15 4.1C14.1 4 13.1 4 12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C14.2 20 16.2 19.1 17.7 17.7C16.1 19.1 14 20 12 20C8.7 20 6 17.3 6 14C6 11.8 7.2 9.9 9 8.9C8.4 9.8 8 10.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 10.9 15.5 9.9 14.8 9.2C16.7 9.8 18 11.7 18 13.8C18 16.7 15.3 19 12 19V22Z"
          fill="#00BCF2"
        />
        <path
          d="M12 22C16 22 19.5 19.5 21 16C19 18.5 15.8 20 12 20C8.7 20 6 17.3 6 14C6 11.8 7.2 9.9 9 8.9C6.5 10.5 5 13.3 5 16.5C5 19.5 8.1 22 12 22Z"
          fill="#107C41"
        />
      </svg>
    );
  }

  // Mozilla Firefox
  if (p === 'firefox' || p === 'firefox add-ons') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Mozilla Firefox"
      >
        <circle cx="12" cy="12" r="10" fill="#FF7139" />
        <path
          d="M12 2C7 2 3 5.5 2.2 10.2C3.1 9.5 4.2 9 5.4 9C8.2 9 10.5 11.2 10.5 14C10.5 15.4 9.9 16.7 9 17.6C9.9 18 10.9 18.2 12 18.2C16.4 18.2 20 14.6 20 10.2C20 5.7 16.4 2 12 2Z"
          fill="#FF9400"
        />
        <path
          d="M12 4C8.7 4 6 6.7 6 10C6 11.2 6.3 12.3 7 13.2C6.4 12.5 6 11.6 6 10.5C6 8.6 7.6 7 9.5 7C11.4 7 13 8.6 13 10.5C13 12.4 11.4 14 9.5 14C8.7 14 8 13.7 7.4 13.2C8.3 14.9 10 16 12 16C15.3 16 18 13.3 18 10C18 6.7 15.3 4 12 4Z"
          fill="#9059FF"
        />
        <circle cx="12" cy="12" r="4.5" fill="#0052CC" />
      </svg>
    );
  }

  // JetBrains / IntelliJ IDEA
  if (p === 'jetbrains' || p === 'intellij' || p === 'ij' || p === 'webstorm') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="JetBrains"
      >
        <rect width="24" height="24" rx="5" fill="#000000" />
        <path
          d="M4.5 4.5H19.5V19.5H4.5V4.5Z"
          fill="#000000"
        />
        <path
          d="M5 19L14 4L19 7L10 22L5 19Z"
          fill="#FE2857"
        />
        <path
          d="M5 19L11 9L19 17L13 22L5 19Z"
          fill="#0079F2"
        />
        <path
          d="M11 9L19 7L19 17L11 9Z"
          fill="#FFC700"
        />
        <rect x="7" y="16.5" width="10" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Cursor IDE
  if (p === 'cursor') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Cursor"
      >
        <rect width="24" height="24" rx="5" fill="#18181B" />
        <path
          d="M7 6L17 12L12 13.5L10 18L7 6Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Windsurf IDE
  if (p === 'windsurf') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Windsurf"
      >
        <rect width="24" height="24" rx="5" fill="#042F2E" />
        <path
          d="M5 15C8 8 11 17 14 10C16 15 18 8 20 12"
          stroke="#2DD4BF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // npm
  if (p === 'npm' || p === 'npm_global') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="npm"
      >
        <rect width="24" height="24" rx="3" fill="#CB3837" />
        <path
          d="M5 7H19V17H12V10H9V17H5V7Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Python / PyPI
  if (p === 'python' || p === 'pypi') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Python"
      >
        <path
          d="M11.9 2C8.3 2 8.5 3.5 8.5 3.5V5.1H12.1V5.6H4.7C3.1 5.6 2 6.8 2 8.6C2 10.4 2.8 11.4 4.7 11.4H6.1V9.8C6.1 8.2 7.5 6.9 9.3 6.9H13.6C14.7 6.9 15.6 6 15.6 4.9C15.6 3.4 14.5 2 11.9 2ZM10.2 3.1C10.7 3.1 11.1 3.5 11.1 4C11.1 4.5 10.7 4.9 10.2 4.9C9.7 4.9 9.3 4.5 9.3 4C9.3 3.5 9.7 3.1 10.2 3.1Z"
          fill="#3776AB"
        />
        <path
          d="M12.1 22C15.7 22 15.5 20.5 15.5 20.5V18.9H11.9V18.4H19.3C20.9 18.4 22 17.2 22 15.4C22 13.6 21.2 12.6 19.3 12.6H17.9V14.2C17.9 15.8 16.5 17.1 14.7 17.1H10.4C9.3 17.1 8.4 18 8.4 19.1C8.4 20.6 9.5 22 12.1 22ZM13.8 20.9C13.3 20.9 12.9 20.5 12.9 20C12.9 19.5 13.3 19.1 13.8 19.1C14.3 19.1 14.7 19.5 14.7 20C14.7 20.5 14.3 20.9 13.8 20.9Z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // Docker
  if (p === 'docker') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Docker"
      >
        <path
          d="M22.5 10.5C21.8 10 20.8 10 20 10.3C19.5 8.9 18.3 8 16.8 8C16.5 8 16.2 8 16 8.1V7.5C16 7.2 15.8 7 15.5 7H13.5C13.2 7 13 7.2 13 7.5V10.5H11V5.5C11 5.2 10.8 5 10.5 5H8.5C8.2 5 8 5.2 8 5.5V10.5H6V8.5C6 8.2 5.8 8 5.5 8H3.5C3.2 8 3 8.2 3 8.5V10.5H1.5C1.2 10.5 1 10.7 1 11C1 15.4 4.6 19 9 19C15.2 19 20.4 14.7 21.8 11.2C22.4 11.2 22.8 10.8 22.5 10.5Z"
          fill="#2496ED"
        />
      </svg>
    );
  }

  // Git / GitHub
  if (p === 'git' || p === 'github') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Git"
      >
        <path
          d="M21.6 10.9L13.1 2.4C12.3 1.6 11.1 1.6 10.3 2.4L8.7 4L11 6.3C11.6 6.1 12.3 6.3 12.8 6.8C13.3 7.3 13.5 8 13.3 8.6L15.5 10.8C16.1 10.6 16.8 10.8 17.3 11.3C18.1 12.1 18.1 13.3 17.3 14.1C16.5 14.9 15.3 14.9 14.5 14.1C14 13.6 13.8 12.9 14 12.3L12 10.3V15.2C12.2 15.4 12.3 15.7 12.3 16C12.3 17.1 11.4 18 10.3 18C9.2 18 8.3 17.1 8.3 16C8.3 15.2 8.8 14.5 9.5 14.2V8.8C8.8 8.5 8.3 7.8 8.3 7C8.3 6.4 8.6 5.8 9 5.4L6.9 3.3L2.4 7.8C1.6 8.6 1.6 9.8 2.4 10.6L10.9 19.1C11.7 19.9 12.9 19.9 13.7 19.1L21.6 11.2C22.4 10.4 22.4 9.2 21.6 10.9Z"
          fill="#F05032"
        />
      </svg>
    );
  }

  // Homebrew
  if (p === 'homebrew' || p === 'brew') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Homebrew"
      >
        <path
          d="M17 6V4H7V6H4V13C4 16.3 6.7 19 10 19H14C17.3 19 20 16.3 20 13V6H17ZM6 11V8H7V11H6ZM18 11H17V8H18V11Z"
          fill="#FBB040"
        />
        <path d="M10 21H14V23H10V21Z" fill="#FBB040" />
      </svg>
    );
  }

  // Apple / macOS
  if (p === 'apple' || p === 'macos' || p === 'darwin') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Apple"
      >
        <path d="M18.7 19.5C17.7 21 16.6 22.4 15 22.5C13.4 22.5 12.9 21.5 11 21.5C9.2 21.5 8.6 22.4 7.1 22.5C5.6 22.5 4.3 20.9 3.3 19.5C1.3 16.6 0.7 12.3 2.3 9.5C3.3 7.8 5.1 6.8 7 6.8C8.5 6.8 9.5 7.8 10.7 7.8C11.8 7.8 12.6 6.8 14.3 6.8C15.9 6.8 17.5 7.6 18.5 9C15.1 11 15.6 15.8 18.7 17.1C18.1 18.7 17.3 20.3 18.7 19.5ZM14.9 4.6C15.6 3.7 16 2.4 15.8 1.1C14.7 1.2 13.3 1.9 12.5 2.8C11.8 3.6 11.3 4.9 11.5 6.2C12.7 6.3 14.1 5.5 14.9 4.6Z" />
      </svg>
    );
  }

  // Go / Golang
  if (p === 'go' || p === 'golang') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Go"
      >
        <path
          d="M1.5 10H8.5V11.5H1.5V10ZM3 7.5H10V9H3V7.5ZM5 12.5H8.5V14H5V12.5ZM17.5 8.5C15 8.5 13 10 13 12.5C13 15 15 16.5 17.5 16.5C19.2 16.5 20.5 15.7 21.2 14.5H17.5V13H23V13.8C22.2 16.8 19.5 18 17.5 18C13.8 18 11 15.3 11 12.5C11 9.7 13.8 7 17.5 7C19.8 7 21.8 8.2 22.5 10.2L21 10.9C20.5 9.4 19.2 8.5 17.5 8.5Z"
          fill="#00ADD8"
        />
      </svg>
    );
  }

  // Hugging Face
  if (p === 'huggingface' || p === 'hf') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Hugging Face"
      >
        <circle cx="12" cy="12" r="10" fill="#FFD21E" />
        <circle cx="8" cy="10" r="1.5" fill="#000000" />
        <circle cx="16" cy="10" r="1.5" fill="#000000" />
        <path
          d="M8 14C9.5 16.5 14.5 16.5 16 14"
          stroke="#000000"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M4 14C5 12 6 12 7 14"
          stroke="#FF9D00"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 14C19 12 18 12 17 14"
          stroke="#FF9D00"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Ollama
  if (p === 'ollama') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Ollama"
      >
        <rect width="24" height="24" rx="5" fill="#000000" />
        <circle cx="12" cy="10" r="4" fill="#FFFFFF" />
        <path
          d="M9 13V19C9 20 15 20 15 19V13"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10.5" cy="9.5" r="0.8" fill="#000000" />
        <circle cx="13.5" cy="9.5" r="0.8" fill="#000000" />
      </svg>
    );
  }

  // Open VSX
  if (p === 'open vsx' || p === 'open vsx registry') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Open VSX"
      >
        <rect width="24" height="24" rx="4" fill="#7C3AED" />
        <path
          d="M6 7L12 17L18 7"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Microsoft Office
  if (p === 'office' || p === 'microsoft office' || p === 'office add-ins') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Microsoft Office"
      >
        <rect width="24" height="24" rx="4" fill="#EA3E23" />
        <path
          d="M7 6H17V18H7V6Z"
          fill="#FFFFFF"
        />
        <rect x="9.5" y="9" width="5" height="6" fill="#EA3E23" />
      </svg>
    );
  }

  // Generic fallback
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
