'use client';

import React, { useState } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <HStack align="flex-start" h="100vh" gap={0}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <Box
        flex={1}
        ml={{ base: 0, lg: isSidebarCollapsed ? '80px' : '280px' }}
        transition="margin-left 0.3s ease"
        h="100vh"
        overflow="auto"
      >
        {children}
      </Box>
    </HStack>
  );
};
