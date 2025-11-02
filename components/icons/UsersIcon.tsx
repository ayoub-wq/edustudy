
import React, { FC, SVGProps } from 'react';

const UsersIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253 9.5 9.5 0 0 0-1.12-1.488m-16.262 3.368a9.5 9.5 0 0 1 1.12-1.488 9.337 9.337 0 0 1 4.121 2.253 9.38 9.38 0 0 1 2.625-.372M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM7.5 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export default UsersIcon;
