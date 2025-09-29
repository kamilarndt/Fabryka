# NextFab - Cursor Agents Configuration

## Agent Profiles

### 1. Development Agent
**Purpose**: Primary development tasks
**Model**: Claude-4 Sonnet
**Capabilities**:
- Code generation and refactoring
- Test writing (TDD approach)
- Bug fixing and debugging
- Documentation generation

**Usage**:
```
@agents/development Implement new project creation feature with TDD approach
```

### 2. Testing Agent
**Purpose**: Test automation and quality assurance
**Model**: Claude-4 Sonnet
**Capabilities**:
- Unit test generation (Vitest)
- E2E test creation (Playwright)
- Test coverage analysis
- Performance testing

**Usage**:
```
@agents/testing Create comprehensive test suite for projects module
```

### 3. Documentation Agent
**Purpose**: Documentation and knowledge management
**Model**: GPT-4.1
**Capabilities**:
- API documentation generation
- Code comments and JSDoc
- User guides and tutorials
- Architecture documentation

**Usage**:
```
@agents/documentation Generate API docs for projects endpoints
```

### 4. Security Agent
**Purpose**: Security analysis and hardening
**Model**: Claude-4 Opus
**Capabilities**:
- Security vulnerability scanning
- Authentication and authorization review
- Data validation and sanitization
- Security best practices enforcement

**Usage**:
```
@agents/security Review authentication implementation for security issues
```

### 5. Performance Agent
**Purpose**: Performance optimization
**Model**: Claude-4 Sonnet
**Capabilities**:
- Code performance analysis
- Database query optimization
- Frontend performance tuning
- Bundle size optimization

**Usage**:
```
@agents/performance Optimize database queries in projects module
```

## Agent Workflows

### Feature Development Workflow
1. **Development Agent**: Implement feature with TDD
2. **Testing Agent**: Create comprehensive test suite
3. **Security Agent**: Review for security issues
4. **Performance Agent**: Optimize performance
5. **Documentation Agent**: Generate documentation

### Bug Fix Workflow
1. **Development Agent**: Analyze and fix bug
2. **Testing Agent**: Add regression tests
3. **Security Agent**: Verify fix doesn't introduce vulnerabilities
4. **Documentation Agent**: Update relevant documentation

### Code Review Workflow
1. **Security Agent**: Security review
2. **Performance Agent**: Performance review
3. **Testing Agent**: Test coverage review
4. **Documentation Agent**: Documentation review

## Agent Configuration

### Environment Variables
```bash
# Agent-specific configurations
CURSOR_AGENT_DEVELOPMENT_MODEL=claude-4-sonnet
CURSOR_AGENT_TESTING_MODEL=claude-4-sonnet
CURSOR_AGENT_DOCUMENTATION_MODEL=gpt-4.1
CURSOR_AGENT_SECURITY_MODEL=claude-4-opus
CURSOR_AGENT_PERFORMANCE_MODEL=claude-4-sonnet
```

### Agent Permissions
- **Development Agent**: Full codebase access, file modification, test execution
- **Testing Agent**: Read access, test file creation, test execution
- **Documentation Agent**: Read access, documentation file creation
- **Security Agent**: Read access, security report generation
- **Performance Agent**: Read access, performance report generation

## Best Practices

### Agent Communication
- Use clear, specific prompts
- Provide relevant context with @File references
- Specify expected output format
- Include success criteria

### Agent Selection
- Choose appropriate agent for task type
- Use specialized agents for complex domains
- Combine agents for comprehensive solutions
- Monitor agent performance and adjust

### Agent Limitations
- Always review agent output
- Verify security implications
- Test agent-generated code
- Maintain human oversight
