
import React, { FC, SVGProps } from 'react';

const UserPlusIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 19.5h17.25a2.25 2.25 0 0 0 2.25-2.25v-1.125c0-.98-.797-1.77-1.78-1.77h-1.921a2.25 2.25 0 0 1-2.183-1.603l-.42-1.42a2.25 2.25 0 0 0-2.184-1.603h-3.468a2.25 2.25 0 0 0-2.184 1.603l-.42 1.42a2.25 2.25 0 0 1-2.183 1.603H3.375c-.983 0-1.78.79-1.78 1.77v1.125a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

export default UserPlusIcon;
