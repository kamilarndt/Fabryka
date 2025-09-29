// Mock Supabase client for testing with state management
const mockData: Record<string, any[]> = {};

// Function to clear all mock data
export const clearMockData = () => {
  Object.keys(mockData).forEach(key => {
    mockData[key] = [];
  });
};

export const mockSupabase = {
  from: (table: string) => {
    console.log(`Mock Supabase: from(${table})`);
    
    // Initialize table data if it doesn't exist
    if (!mockData[table]) {
      mockData[table] = [];
    }
    
    return {
      select: (columns = '*') => {
        console.log(`Mock Supabase: select(${columns})`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase: eq(${column}, ${value})`);
            const filtered = mockData[table].filter(item => item[column] === value);
            return {
              single: () => {
                const found = filtered[0] || null;
                console.log(`Mock Supabase: single() - returning:`, found);
                return Promise.resolve({ data: found, error: null });
              },
              limit: (count: number) => {
                const limited = filtered.slice(0, count);
                console.log(`Mock Supabase: limit(${count}) - returning:`, limited);
                return Promise.resolve({ data: limited, error: null });
              },
              order: (orderColumn: string, options: any) => {
                const sorted = [...filtered].sort((a, b) => {
                  if (options.ascending === false) {
                    return b[orderColumn] > a[orderColumn] ? 1 : -1;
                  }
                  return a[orderColumn] > b[orderColumn] ? 1 : -1;
                });
                console.log(`Mock Supabase: order(${orderColumn}, ${JSON.stringify(options)}) after eq - returning:`, sorted);
                return Promise.resolve({ data: sorted, error: null });
              }
            };
          },
          neq: (column: string, value: any) => {
            console.log(`Mock Supabase: neq(${column}, ${value})`);
            return {
              single: () => {
                const found = mockData[table].find(item => item[column] !== value);
                console.log(`Mock Supabase: single() - returning:`, found);
                return Promise.resolve({ data: found || null, error: null });
              }
            };
          },
          limit: (count: number) => {
            const limited = mockData[table].slice(0, count);
            console.log(`Mock Supabase: limit(${count}) - returning:`, limited);
            return Promise.resolve({ data: limited, error: null });
          },
          order: (column: string, options: any) => {
            const sorted = [...mockData[table]].sort((a, b) => {
              if (options.ascending === false) {
                return b[column] > a[column] ? 1 : -1;
              }
              return a[column] > b[column] ? 1 : -1;
            });
            console.log(`Mock Supabase: order(${column}, ${JSON.stringify(options)}) - returning:`, sorted);
            return Promise.resolve({ data: sorted, error: null });
          }
        };
      },
      insert: (data: any) => {
        console.log(`Mock Supabase: insert(${JSON.stringify(data)})`);
        
        // Handle both single object and array of objects
        const dataArray = Array.isArray(data) ? data : [data];
        const results = dataArray.map(item => ({
          id: 'test-id-123', 
          ...item, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        // Add to mock data
        mockData[table].push(...results);
        
        return {
          select: () => {
            console.log(`Mock Supabase: select() after insert`);
            return {
              single: () => {
                const result = results[0];
                console.log(`Mock Supabase: single() after insert - returning:`, result);
                return Promise.resolve({ 
                  data: result, 
                  error: null 
                });
              }
            };
          }
        };
      },
      update: (data: any) => {
        console.log(`Mock Supabase: update(${JSON.stringify(data)})`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase: eq(${column}, ${value}) after update`);
            return {
              select: () => {
                console.log(`Mock Supabase: select() after update`);
                return {
                  single: () => {
                    const index = mockData[table].findIndex(item => item[column] === value);
                    if (index !== -1) {
                      const result = { 
                        ...mockData[table][index],
                        ...data, 
                        updated_at: new Date().toISOString()
                      };
                      mockData[table][index] = result;
                      console.log(`Mock Supabase: single() after update - returning:`, result);
                      return Promise.resolve({ 
                        data: result, 
                        error: null 
                      });
                    } else {
                      console.log(`Mock Supabase: single() after update - not found`);
                      return Promise.resolve({ 
                        data: null, 
                        error: null 
                      });
                    }
                  }
                };
              }
            };
          }
        };
      },
      delete: () => {
        console.log(`Mock Supabase: delete()`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock Supabase: eq(${column}, ${value}) after delete`);
            const index = mockData[table].findIndex(item => item[column] === value);
            if (index !== -1) {
              mockData[table].splice(index, 1);
            }
            return Promise.resolve({ data: null, error: null });
          },
          neq: (column: string, value: any) => {
            console.log(`Mock Supabase: neq(${column}, ${value}) after delete`);
            // Remove all items that match the value (keep items that don't match)
            mockData[table] = mockData[table].filter(item => item[column] !== value);
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    };
  }
};

export type MockSupabase = typeof mockSupabase;
