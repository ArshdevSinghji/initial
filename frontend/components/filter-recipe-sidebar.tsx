import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import { RecipeCategory } from "@/utils/enum";
import { Button, Divider, Typography } from "@mui/material";
import { useAppDispatch } from "@/redux/hook";
import { getRecipesByCategoryThunk } from "@/redux/thunk/recipe.thunk";

const FilterRecipeSidebar: React.FC<{
  open: boolean;
  toggleDrawer: (newOpen: boolean) => () => void;
}> = ({ open, toggleDrawer }) => {
  const dispatch = useAppDispatch();
  const [checkedCategories, setCheckedCategories] = React.useState<string[]>(
    []
  );
  const handleToggle = (category: string) => {
    setCheckedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };
  const handleApplyFilters = async () => {
    console.log("Applying filters:", checkedCategories);
    await dispatch(
      getRecipesByCategoryThunk({
        category: checkedCategories,
        limit: 10,
        offset: 0,
      })
    );
    toggleDrawer(false)();
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Typography variant="h6" sx={{ padding: "10px" }}>
        Filter Recipes
      </Typography>
      <Divider />
      <List>
        {Object.values(RecipeCategory).map((text, index) => (
          <>
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleToggle(text)}>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  checked={checkedCategories.includes(text)}
                />
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      <Button
        variant="contained"
        sx={{ margin: "10px" }}
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default FilterRecipeSidebar;
