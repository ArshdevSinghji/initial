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

export const addRecipeButton = {
  position: "fixed",
  bottom: 32,
  right: 32,
  "&: hover": {
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    scale: 1.1,
  },
};
