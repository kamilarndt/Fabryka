-- NextFab Database Initialization
-- PostgreSQL schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'paused', 'cancelled');
CREATE TYPE material_unit AS ENUM ('szt', 'm', 'm2', 'kg');

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    project_number VARCHAR(50) UNIQUE NOT NULL,
    status project_status DEFAULT 'draft',
    client_id UUID NOT NULL,
    modules TEXT[] DEFAULT '{}',
    timeline JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20),
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact persons table
CREATE TABLE contact_persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials table
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category TEXT[] DEFAULT '{}',
    specification JSONB DEFAULT '{}',
    unit material_unit NOT NULL,
    default_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for projects
ALTER TABLE projects ADD CONSTRAINT fk_projects_client_id 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_contact_persons_client_id ON contact_persons(client_id);
CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_category ON materials USING GIN(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_persons_updated_at 
    BEFORE UPDATE ON contact_persons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at 
    BEFORE UPDATE ON materials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO clients (id, name, tax_id, address) VALUES
    (uuid_generate_v4(), 'Klient ABC Sp. z o.o.', '1234567890', '{"street": "ul. Przykładowa 123", "city": "Kraków", "zipCode": "30-001", "country": "Polska"}'),
    (uuid_generate_v4(), 'Firma XYZ', '0987654321', '{"street": "ul. Testowa 456", "city": "Warszawa", "zipCode": "00-001", "country": "Polska"}');

INSERT INTO contact_persons (client_id, name, email, phone, position) 
SELECT c.id, 'Jan Kowalski', 'jan.kowalski@klientabc.pl', '+48 123 456 789', 'Dyrektor'
FROM clients c WHERE c.name = 'Klient ABC Sp. z o.o.';

INSERT INTO materials (name, sku, category, specification, unit, default_price) VALUES
    ('PŁYTA WIÓROWA SUROWA 18MM', 'PWS18', ARRAY['Płyty', 'MDF', 'Surowe'], '{"thickness": 18, "width": 2500, "height": 1250}', 'szt', 45.50),
    ('PŁYTA MDF 15MM', 'MDF15', ARRAY['Płyty', 'MDF', 'Gotowe'], '{"thickness": 15, "width": 2500, "height": 1250}', 'szt', 52.00),
    ('LISTWA OZDOBNA 20X20MM', 'LO2020', ARRAY['Listwy', 'Drewniane'], '{"width": 20, "height": 20}', 'm', 8.50);

-- Create sample project
INSERT INTO projects (name, project_number, status, client_id, modules, timeline)
SELECT 
    'Projekt Stoisko 2025',
    'P2025/01/15',
    'active',
    c.id,
    ARRAY['overview', 'elements', 'quotation'],
    '{"startDate": "2025-01-15", "endDate": "2025-03-15"}'
FROM clients c WHERE c.name = 'Klient ABC Sp. z o.o.';

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - allow all for development)
CREATE POLICY "Allow all operations for authenticated users" ON projects
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON clients
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON contact_persons
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON materials
    FOR ALL TO authenticated USING (true);

-- Create views for common queries
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.project_number,
    p.status,
    c.name as client_name,
    p.created_at,
    p.updated_at
FROM projects p
JOIN clients c ON p.client_id = c.id;

CREATE VIEW client_with_contacts AS
SELECT 
    c.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', cp.id,
                'name', cp.name,
                'email', cp.email,
                'phone', cp.phone,
                'position', cp.position
            )
        ) FILTER (WHERE cp.id IS NOT NULL),
        '[]'::json
    ) as contact_people
FROM clients c
LEFT JOIN contact_persons cp ON c.id = cp.client_id
GROUP BY c.id;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
