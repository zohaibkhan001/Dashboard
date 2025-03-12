import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, Checkbox } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useSelector } from 'react-redux';

const MasterMenu = ({ selectedMenu, selectedMeals, setSelectedMeals }) => {
  const { quickMeals } = useSelector((state) => state.quickMeals);
  const { dailyMeals } = useSelector((state) => state.repeatingMeals);
  const { liveCounterMeals } = useSelector((state) => state.liveCounterMeals);

  const [menuItems, setMenuItems] = useState([]);

  // Update Master Menu based on selectedMenu
  useEffect(() => {
    if (selectedMenu === 'quick') {
      setMenuItems(quickMeals);
    } else if (selectedMenu === 'repeating') {
      setMenuItems(dailyMeals);
    } else if (selectedMenu === 'liveCounter') {
      setMenuItems(liveCounterMeals);
    } else {
      setMenuItems([]);
    }
  }, [selectedMenu, quickMeals, dailyMeals, liveCounterMeals]);

  // Handle selecting a meal
  const handleMealSelect = (mealId) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.includes(mealId)
        ? prevSelected.filter((id) => id !== mealId)
        : [...prevSelected, mealId]
    );
  };

  return (
    <Box sx={{ width: '250px', flexShrink: 0, borderRight: '1px solid #ddd', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Master Menu ({selectedMenu})
      </Typography>
      <Scrollbar sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        {menuItems?.length > 0 ? (
          <List>
            {menuItems.map((meal) => (
              <ListItem key={meal.meal_id} button onClick={() => handleMealSelect(meal.meal_id)}>
                <Checkbox checked={selectedMeals.includes(meal.meal_id)} />
                <Typography>{meal.mealName}</Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="gray" textAlign="center">
            No data available
          </Typography>
        )}
      </Scrollbar>
    </Box>
  );
};

export default MasterMenu;

// const MenuContainer = () => {
//   const [selectedMenu, setSelectedMenu] = useState('quick'); // Default selection
//   const [selectedMeals, setSelectedMeals] = useState([]); // Stores selected meal_ids

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         height: '600px',
//         border: '1px solid #ccc',
//         borderRadius: 2,
//         overflow: 'hidden',
//       }}
//     >
//       {/* Fixed Master Menu Column */}
//       <MasterMenu
//         selectedMenu={selectedMenu}
//         selectedMeals={selectedMeals}
//         setSelectedMeals={setSelectedMeals}
//       />

//       {/* Placeholder for other columns */}
//       <Box sx={{ flexGrow: 1, p: 2 }}>
//         <Typography variant="h6">Other Content Goes Here</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default MenuContainer;
