const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Konfiguracja Supabase
const supabaseUrl = 'https://iwzsvxmttyanzsijlywm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3enN2eG10dHlhbnpzaWpseXdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1Mzc1MywiZXhwIjoyMDc0NzI5NzUzfQ.CjjNoYl7HxY9FBulvXF1fdXCyyDuJ-P_de4ALzkoSYk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDatabase() {
  try {
    console.log('Inicjalizacja bazy danych...');
    
    // Wczytaj plik SQL
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Podziel SQL na pojedyncze zapytania
    const queries = sqlContent
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));
    
    console.log(`Znaleziono ${queries.length} zapytań do wykonania`);
    
    // Wykonaj każde zapytanie
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        console.log(`Wykonywanie zapytania ${i + 1}/${queries.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: query });
          
          if (error) {
            console.error(`Błąd w zapytaniu ${i + 1}:`, error);
            // Nie przerywaj - niektóre zapytania mogą się nie powieść (np. CREATE EXTENSION)
          } else {
            console.log(`✓ Zapytanie ${i + 1} wykonane pomyślnie`);
          }
        } catch (err) {
          console.error(`Błąd w zapytaniu ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('Inicjalizacja bazy danych zakończona!');
    
    // Sprawdź czy tabele zostały utworzone
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Błąd podczas sprawdzania tabel:', tablesError);
    } else {
      console.log('Utworzone tabele:', tables?.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error('Błąd podczas inicjalizacji bazy danych:', error);
  }
}

// Uruchom inicjalizację
initDatabase();
