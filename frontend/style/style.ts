export const divider = {
  py: 0,
  width: "100%",
  maxWidth: 360,
  borderColor: "divider",
  backgroundColor: "background.paper",
};

export const auth = {
  maxWidth: "14em",
};

export const modal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const addButton = {
  position: "fixed",
  bottom: 32,
  right: 32,
  "&: hover": {
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    scale: 1.1,
  },
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string) {
  if (typeof name !== "string" || !name.trim()) {
    name = "Unknown User";
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: 16,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
