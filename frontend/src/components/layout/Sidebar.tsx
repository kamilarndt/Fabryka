'use client';

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@chakra-ui/react';
import {
  FiHome,
  FiFolder,
  FiUsers,
  FiPackage,
  FiGrid,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <FiHome /> },
  { label: 'Projekty', href: '/projects', icon: <FiFolder /> },
  { label: 'Klienci', href: '/clients', icon: <FiUsers /> },
  { label: 'Materiały', href: '/materials', icon: <FiPackage /> },
  { label: 'Elementy', href: '/elements', icon: <FiGrid /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Box display={{ base: 'block', lg: 'none' }} p={4}>
        <Button
          variant="ghost"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          leftIcon={isMobileOpen ? <FiX /> : <FiMenu />}
        >
          Menu
        </Button>
      </Box>

      {/* Sidebar */}
      <Collapsible.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <CollapsibleContent>
          <Box
            w={{ base: '100%', lg: isCollapsed ? '80px' : '280px' }}
            h="100vh"
            bg="white"
            borderRight="1px"
            borderColor="gray.200"
            position={{ base: 'relative', lg: 'fixed' }}
            top={0}
            left={0}
            zIndex={10}
            transition="width 0.3s ease"
          >
            <VStack h="full" align="stretch" p={4} gap={6}>
              {/* Logo */}
              <HStack justify={isCollapsed ? 'center' : 'flex-start'} gap={3}>
                <Box
                  w={8}
                  h={8}
                  bg="blue.500"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                >
                  N
                </Box>
                {!isCollapsed && (
                  <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    NextFab
                  </Text>
                )}
              </HStack>

              {/* Navigation */}
              <VStack gap={2} align="stretch" flex={1}>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'solid' : 'ghost'}
                      colorPalette={isActive(item.href) ? 'blue' : 'gray'}
                      w="full"
                      justifyContent={isCollapsed ? 'center' : 'flex-start'}
                      leftIcon={!isCollapsed ? item.icon : undefined}
                      rightIcon={
                        !isCollapsed && item.badge ? (
                          <Badge colorPalette="red" variant="solid" size="sm">
                            {item.badge}
                          </Badge>
                        ) : undefined
                      }
                      size="lg"
                    >
                      {isCollapsed ? item.icon : item.label}
                    </Button>
                  </Link>
                ))}
              </VStack>

              {/* User Profile */}
              <Box
                borderTop="1px"
                borderColor="gray.200"
                pt={4}
              >
                <HStack gap={3} justify={isCollapsed ? 'center' : 'flex-start'}>
                  <Avatar
                    size="sm"
                    name="Użytkownik"
                    src=""
                  />
                  {!isCollapsed && (
                    <VStack gap={0} align="flex-start" flex={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        Użytkownik
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        user@example.com
                      </Text>
                    </VStack>
                  )}
                </HStack>

                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiLogOut />}
                    onClick={handleLogout}
                    mt={2}
                    w="full"
                    justifyContent="flex-start"
                  >
                    Wyloguj
                  </Button>
                )}
              </Box>
            </VStack>
          </Box>
        </CollapsibleContent>
      </Collapsible.Root>
    </>
  );
};
