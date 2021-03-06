import React from 'react';
import { PageSidebar, Nav, NavList, NavItem, NavExpandable, capitalize, Divider } from '@patternfly/react-core';
import { NavLink, useLocation } from "react-router-dom";
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';

const SidebarItem = ({ text, href, exact, apiName }) => (
  <NavItem>
    <NavLink
      to={href.replace('*', apiName)}
      activeClassName="pf-m-current"
      exact={exact}
    >
      {text}
    </NavLink>
  </NavItem>
);

const Sidebar = ({ routes }) => {
  const { pathname } = useLocation();
  const split = pathname.replace(/\/$/, '').split('/');
  const apiName = split.length > 1 ? split[split.length - 1] : null;
  
  const sectionedRoutes = routes
    .filter(({ section }) => Boolean(section))
    .reduce((acc, cur) => {
      acc[cur.section] = acc[cur.section] || [];
      acc[cur.section].push(cur);

      return acc;
    }, {});

  return <PageSidebar nav={
    <Nav>
      <NavList>
        <SidebarItem href="/" text="Dashboard" exact />
        {apiName && (
          <React.Fragment>
            <li className="pf-c-nav__item" style={{ padding: '16px 24px 0 24px', marginTop: '2em', color: 'white' }}>
              <CubesIcon style={{ marginRight: '8px' }} />{apiName}
            </li>
            <Divider />
          </React.Fragment>
        )}
        {apiName && Object.entries(sectionedRoutes)
          .map(([section, items]) => [section, items, location.hash.startsWith(`#/${section}`)])
          .map(([section, items, isActive]) => (
            <NavExpandable
              key={section}
              title={`${capitalize(section)} APIs`}
              isExpanded={isActive}
            >
              {items.map(({ path, text }) => (
                <SidebarItem key={path + text} href={path} text={text} apiName={apiName} />
              ))}
            </NavExpandable>
          ))}
      </NavList>
    </Nav>
  } />
}

export default Sidebar;
