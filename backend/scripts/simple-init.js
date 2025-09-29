const { createClient } = require('@supabase/supabase-js');

// Konfiguracja Supabase
const supabaseUrl = 'https://iwzsvxmttyanzsijlywm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3enN2eG10dHlhbnpzaWpseXdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1Mzc1MywiZXhwIjoyMDc0NzI5NzUzfQ.CjjNoYl7HxY9FBulvXF1fdXCyyDuJ-P_de4ALzkoSYk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('Tworzenie tabel...');
    
    // Utwórz tabelę clients
    console.log('Tworzenie tabeli clients...');
    const { error: clientsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          tax_id VARCHAR(20),
          address JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (clientsError) {
      console.error('Błąd tworzenia tabeli clients:', clientsError);
    } else {
      console.log('✓ Tabela clients utworzona');
    }
    
    // Utwórz tabelę contact_persons
    console.log('Tworzenie tabeli contact_persons...');
    const { error: contactsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_persons (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          position VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (contactsError) {
      console.error('Błąd tworzenia tabeli contact_persons:', contactsError);
    } else {
      console.log('✓ Tabela contact_persons utworzona');
    }
    
    // Utwórz tabelę projects
    console.log('Tworzenie tabeli projects...');
    const { error: projectsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          project_number VARCHAR(50) UNIQUE NOT NULL,
          status VARCHAR(20) DEFAULT 'draft',
          client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          modules TEXT[] DEFAULT '{}',
          timeline JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (projectsError) {
      console.error('Błąd tworzenia tabeli projects:', projectsError);
    } else {
      console.log('✓ Tabela projects utworzona');
    }
    
    // Wstaw przykładowe dane
    console.log('Wstawianie przykładowych danych...');
    
    // Wstaw klienta
    const { data: client, error: clientInsertError } = await supabase
      .from('clients')
      .insert({
        name: 'Klient ABC Sp. z o.o.',
        tax_id: '1234567890',
        address: {
          street: 'ul. Przykładowa 123',
          city: 'Kraków',
          zipCode: '30-001',
          country: 'Polska'
        }
      })
      .select()
      .single();
    
    if (clientInsertError) {
      console.error('Błąd wstawiania klienta:', clientInsertError);
    } else {
      console.log('✓ Klient wstawiony:', client.name);
      
      // Wstaw kontakt
      const { error: contactInsertError } = await supabase
        .from('contact_persons')
        .insert({
          client_id: client.id,
          name: 'Jan Kowalski',
          email: 'jan.kowalski@klientabc.pl',
          phone: '+48 123 456 789',
          position: 'Dyrektor'
        });
      
      if (contactInsertError) {
        console.error('Błąd wstawiania kontaktu:', contactInsertError);
      } else {
        console.log('✓ Kontakt wstawiony');
      }
      
      // Wstaw projekt
      const { error: projectInsertError } = await supabase
        .from('projects')
        .insert({
          name: 'Projekt Stoisko 2025',
          project_number: 'P2025/01/15',
          status: 'active',
          client_id: client.id,
          modules: ['overview', 'elements', 'quotation'],
          timeline: {
            startDate: '2025-01-15',
            endDate: '2025-03-15'
          }
        });
      
      if (projectInsertError) {
        console.error('Błąd wstawiania projektu:', projectInsertError);
      } else {
        console.log('✓ Projekt wstawiony');
      }
    }
    
    console.log('Inicjalizacja bazy danych zakończona!');
    
  } catch (error) {
    console.error('Błąd podczas inicjalizacji:', error);
  }
}

// Uruchom inicjalizację
createTables();
