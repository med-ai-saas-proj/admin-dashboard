import { useLocation } from "react-router-dom";

export function useIsActivePath() {
	const { pathname } = useLocation();

	const isActive = (basePath: string) => {
		// Exact match
		if (pathname === basePath) return true;

		// If pathname is a direct child of basePath (one extra segment), treat as active.
		// This avoids marking parent sections active when a deeper, more specific
		// nav item exists (e.g. `/organizations/1/projects` should NOT be active
		// when pathname is `/organizations/1/projects/2/users`).
		if (pathname.startsWith(`${basePath}/`)) {
			const remaining = pathname.slice(basePath.length + 1);
			// Active only if there's no additional '/' in the remaining path
			if (remaining.indexOf("/") === -1) return true;
			return false;
		}

		// If the nav item's basePath is actually a nested path of the current
		// pathname (the nav item is more specific than the current path), treat
		// it as active so parent pages highlight their more-specific child when
		// appropriate.
		if (basePath.startsWith(`${pathname}/`)) return true;

		return false;
	};

	return isActive;
}
