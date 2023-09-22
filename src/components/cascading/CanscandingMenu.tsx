import { Toolbar, Hidden } from '@mui/material';
import { MenuListDropdown } from './MenuListDropdown';
import { CascadingMenuProps } from '@/share/InterfaceTypes';
import { MenuListDropdownPeople } from './MenuListDropdownPeople';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ALLENSLAVED, ALLENSLAVERS } from '@/share/CONST_DATA';

export default function CascadingMenu(props: CascadingMenuProps) {
  const { pathName } = useSelector((state: RootState) => state.getPathName);

  return (
    <div
      style={{
        position: 'relative',
        bottom: 12,
      }}
    >
      <Toolbar>
        <Hidden smDown>
          <div>
            {pathName === ALLENSLAVED || pathName === ALLENSLAVERS ? (
              <MenuListDropdownPeople />
            ) : (
              <MenuListDropdown />
            )}
          </div>
        </Hidden>
      </Toolbar>
    </div>
  );
}
