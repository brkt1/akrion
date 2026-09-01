const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></>,
  about: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.3v.2"/></>,
  services: <><path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="1.8" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="10" cy="19" r="1.8" fill="currentColor" stroke="none"/></>,
  portfolio: <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M3 12h18M10 12v2h4v-2"/></>,
  blog: <><path d="M5 3h11l3 3v15H5z"/><path d="M16 3v4h4M8 11h8M8 15h8M8 7h3"/></>,
  inquiries: <><path d="M4 5h16v12H8l-4 4z"/><path d="M8 9h8M8 13h5"/></>,
  media: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-5 3 3 2-2 6 5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/></>,
  edit: <><path d="m4 20 4.2-1 10.7-10.7-3.2-3.2L5 15.8z"/><path d="m13.8 7 3.2 3.2"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></>,
  archive: <><path d="M4 8h16v12H4zM3 4h18v4H3zM9 12h6"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  eye: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  list: <><path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></>,
  warning: <><path d="M12 3 2.8 20h18.4z"/><path d="M12 9v5M12 17.5v.1"/></>,
  check: <path d="m5 12 4 4 10-10"/>,
  refresh: <><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></>,
  arrowUp: <path d="m7 14 5-5 5 5"/>,
  arrowDown: <path d="m7 10 5 5 5-5"/>,
}

const AdminIcon = ({ name, size = 20, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths[name] || paths.dashboard}
  </svg>
)

export default AdminIcon
