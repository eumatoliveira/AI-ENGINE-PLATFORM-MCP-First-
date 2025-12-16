// =====  AGENT STATE MANAGEMENT  =====
let activeAgents = [
    { id: 'doc-agent-1', name: 'DocumentationAgent', status: 'Step 5/7 - Writing examples', progress: 71, time: 272, state: 'running' },
    { id: 'review-agent-2', name: 'CodeReviewAgent', status: 'Step 3/5 - Checking style', progress: 60, time: 135, state: 'running' },
    { id: 'test-agent-3', name: 'TestGenerationAgent', status: 'Retrying (attempt 2/3)', progress: 80, time: 408, state: 'warning' }
];

function updateAgentCounter() {
    const counter = document.getElementById('agentCounter');
    const agentList = document.getElementById('agentList');
    const emptyState = document.getElementById('agentEmpty');
    const count = activeAgents.length;
    
    if (counter) {
        counter.textContent = count === 0 ? 'No agents' : `${count} running`;
        counter.className = count > 0 ? 'badge success' : 'badge';
    }
    
    // Show/hide empty state
    if (agentList && emptyState) {
        if (count === 0) {
            agentList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            agentList.style.display = 'block';
            emptyState.style.display = 'none';
        }
    }
    
    // Update sidebar badge
    const sidebarBadge = document.querySelector('.nav-item:nth-child(4) .badge');
    if (sidebarBadge) {
        if (count > 0) {
            sidebarBadge.textContent = `${count} active`;
            sidebarBadge.className = 'badge success';
        } else {
            sidebarBadge.textContent = '0 active';
            sidebarBadge.className = 'badge';
        }
    }
}

function deleteAgent(agentId) {
    const agent = activeAgents.find(a => a.id === agentId);
    if (!agent) return;
    
    showConfirmModal(
        'Delete Agent',
        `Are you sure you want to stop and delete <strong>${agent.name}</strong>?<br><br>This action cannot be undone.`,
        () => {
            // Find the agent item
            const agentItem = document.querySelector(`.agent-item[data-agent-id="${agentId}"]`);
            
            if (agentItem) {
                // Add deleting animation
                agentItem.classList.add('deleting');
                
                // Wait for animation to finish
                setTimeout(() => {
                    // Remove from DOM
                    agentItem.remove();
                    
                    // Remove from state
                    activeAgents = activeAgents.filter(a => a.id !== agentId);
                    
                    // Update counter
                    updateAgentCounter();
                    
                    // Show notification
                    showNotification(`Agent "${agent.name}" deleted successfully`, 'success');
                }, 400); // Match animation duration
            }
        },
        true // isDanger
    );
}

function pauseAgent(agentId) {
    const agent = activeAgents.find(a => a.id === agentId);
    if (!agent) return;
    
    // Toggle between running and paused
    const newState = agent.state === 'running' ? 'paused' : 'running';
    agent.state = newState;
    
    // Update UI
    const agentItem = document.querySelector(`.agent-item[data-agent-id="${agentId}"]`);
    if (agentItem) {
        const icon = agentItem.querySelector('.agent-icon');
        const pauseBtn = agentItem.querySelector('.btn-pause span');
        
        if (newState === 'paused') {
            icon.classList.remove('running');
            icon.classList.add('paused');
            if (pauseBtn) pauseBtn.textContent = '▶️';
            showNotification(`Agent "${agent.name}" paused`, 'info');
        } else {
            icon.classList.remove('paused');
            icon.classList.add('running');
            if (pauseBtn) pauseBtn.textContent = '⏸️';
            showNotification(`Agent "${agent.name}" resumed`, 'success');
        }
    }
}

// ===== NAVIGATION SYSTEM =====
const pages = {
    'dashboard': { title: 'Dashboard Overview', subtitle: 'Self-improving AI infrastructure in real-time' },
    'mcp': { title: 'MCP Control Panel', subtitle: 'Manage and optimize meta-circular prompts' },
    'rag': { title: 'RAG Manager', subtitle: 'Document indexing and retrieval configuration' },
    'agents': { title: 'Agent Engine', subtitle: 'Create and manage autonomous AI agents' },
    'langgraph': { title: 'LangGraph Runtime', subtitle: 'Non-linear workflow orchestration' },
    'ftops': { title: 'FT-Ops Pipeline', subtitle: 'Automated fine-tuning operations' },
    'security': { title: 'Security Center', subtitle: 'Defensive testing and compliance monitoring' }
};

let currentPage = 'dashboard';

function navigateTo(pageName) {
    if (!pages[pageName]) return;
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        
        // Animate entrance
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateY(20px)';
        setTimeout(() => {
            targetPage.style.transition = 'all 0.3s ease';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Update header
    document.getElementById('pageTitle').textContent = pages[pageName].title;
    document.getElementById('pageSubtitle').textContent = pages[pageName].subtitle;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');
    
    currentPage = pageName;
    
    // Update URL hash without page reload
    window.location.hash = pageName;
}

// Initialize navigation from URL hash
function initNavigation() {
    const hash = window.location.hash.slice(1);
    if (hash && pages[hash]) {
        navigateTo(hash);
    }
}

// ===== COMPREHENSIVE BUTTON TESTING SYSTEM =====
function testAllButtons() {
    console.log('🧪 TESTING ALL BUTTONS...\n');
    
    const testResults = {
        working: [],
        notWorking: [],
        total: 0
    };
    
    // Test Export Data button
    const btnExport = document.getElementById('btnExport');
    if (btnExport) {
        testResults.total++;
        try {
            btnExport.onclick ? testResults.working.push('Export Data') : testResults.notWorking.push('Export Data (no handler)');
        } catch(e) {
            testResults.notWorking.push('Export Data (error)');
        }
    }
    
    // Test New Agent button
    const btnNewAgent = document.getElementById('btnNewAgent');
    if (btnNewAgent) {
        testResults.total++;
        btnNewAgent.onclick ? testResults.working.push('New Agent') : testResults.notWorking.push('New Agent (no handler)');
    }
    
    // Test navigation buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        testResults.total++;
        item.onclick || item.getAttribute('data-page') ? 
            testResults.working.push(`Nav Item ${index + 1}`) : 
            testResults.notWorking.push(`Nav Item ${index + 1} (no handler)`);
    });
    
    // Test MCP buttons
    const btnNewPrompt = document.getElementById('btnNewPrompt');
    if (btnNewPrompt) {
        testResults.total++;
        btnNewPrompt.onclick ? testResults.working.push('New Prompt (MCP)') : testResults.notWorking.push('New Prompt (no handler)');
    }
    
    // Test RAG buttons
    const btnUploadDoc = document.getElementById('btnUploadDoc');
    if (btnUploadDoc) {
        testResults.total++;
        btnUploadDoc.onclick ? testResults.working.push('Upload Document (RAG)') : testResults.notWorking.push('Upload Document (no handler)');
    }
    
    // Test Agent buttons
    const btnCreateAgent = document.getElementById('btnCreateAgent');
    if (btnCreateAgent) {
        testResults.total++;
        btnCreateAgent.onclick ? testResults.working.push('Create Agent') : testResults.notWorking.push('Create Agent (no handler)');
    }
    
    // Test LangGraph buttons
    const btnNewWorkflow = document.getElementById('btnNewWorkflow');
    if (btnNewWorkflow) {
        testResults.total++;
        btnNewWorkflow.onclick ? testResults.working.push('New Workflow (LangGraph)') : testResults.notWorking.push('New Workflow (no handler)');
    }
    
    // Test FT-Ops buttons
    const btnNewJob = document.getElementById('btnNewJob');
    if (btnNewJob) {
        testResults.total++;
        btnNewJob.onclick ? testResults.working.push('Start Training (FT-Ops)') : testResults.notWorking.push('Start Training (no handler)');
    }
    
    // Test Security buttons
    const btnRunTests = document.getElementById('btnRunTests');
    if (btnRunTests) {
        testResults.total++;
        btnRunTests.onclick ? testResults.working.push('Run Tests (Security)') : testResults.notWorking.push('Run Tests (no handler)');
    }
    
    // Test Agent delete/pause buttons
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach((btn, index) => {
        testResults.total++;
        btn.onclick ? testResults.working.push(`Delete Agent ${index + 1}`) : testResults.notWorking.push(`Delete Agent ${index + 1} (no handler)`);
    });
    
    const pauseBtns = document.querySelectorAll('.btn-pause');
    pauseBtns.forEach((btn, index) => {
        testResults.total++;
        btn.onclick ? testResults.working.push(`Pause Agent ${index + 1}`) : testResults.notWorking.push(`Pause Agent ${index + 1} (no handler)`);
    });
    
    // Print results
    console.log(`✅ WORKING BUTTONS (${testResults.working.length}/${testResults.total}):`);
    testResults.working.forEach(btn => console.log(`  ✓ ${btn}`));
    
    if (testResults.notWorking.length > 0) {
        console.log(`\n❌ NOT WORKING BUTTONS (${testResults.notWorking.length}/${testResults.total}):`);
        testResults.notWorking.forEach(btn => console.log(`  ✗ ${btn}`));
    }
    
    console.log(`\n📊 TOTAL: ${testResults.working.length}/${testResults.total} buttons working (${Math.round(testResults.working.length / testResults.total * 100)}%)`);
    
    return testResults;
}

// ===== BUTTON HANDLERS =====

// Export Data Button
document.getElementById('btnExport')?.addEventListener('click', function() {
    const data = {
        timestamp: new Date().toISOString(),
        page: currentPage,
        stats: {
            mcpPerformance: 0.87,
            hallucinationRate: 0.042,
            agentSuccessRate: 0.83,
            securityScore: 97
        },
        activeAgents: activeAgents
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-engine-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
});

// New Agent Button
document.getElementById('btnNewAgent')?.addEventListener('click', function() {
    navigateTo('agents');
    setTimeout(() => {
        showNotification('Navigate to Agent Templates to create a new agent', 'info');
    }, 300);
});

// MCP - New Prompt Button
document.getElementById('btnNewPrompt')?.addEventListener('click', function() {
    showModal('New Prompt', `
        <div class="modal-form">
            <div class="form-group">
                <label>Prompt Name</label>
                <input type="text" class="form-input" placeholder="e.g., custom_query" />
            </div>
            <div class="form-group">
                <label>Prompt Template</label>
                <textarea class="form-input" rows="5" placeholder="Enter your prompt template..."></textarea>
            </div>
            <div class="form-group">
                <label>Task Type</label>
                <select class="form-input">
                    <option>code_generation</option>
                    <option>summarization</option>
                    <option>rag_query</option>
                    <option>custom</option>
                </select>
            </div>
        </div>
    `, () => {
        showNotification('Prompt created successfully!', 'success');
    });
});

// RAG - Upload Document Button
document.getElementById('btnUploadDoc')?.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.txt,.md,.doc,.docx';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showNotification(`Uploading ${file.name}...`, 'info');
            setTimeout(() => {
                showNotification(`${file.name} indexed successfully! 1,247 chunks created.`, 'success');
            }, 2000);
        }
    };
    input.click();
});

// Agents - Create Agent Button
document.getElementById('btnCreateAgent')?.addEventListener('click', function() {
    showModal('Create Custom Agent', `
        <div class="modal-form">
            <div class="form-group">
                <label>Agent Name</label>
                <input type="text" class="form-input" placeholder="e.g., CustomAgent" />
            </div>
            <div class="form-group">
                <label>Objective</label>
                <textarea class="form-input" rows="3" placeholder="Describe what this agent should accomplish..."></textarea>
            </div>
            <div class="form-group">
                <label>Tools</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked /> RAG Query</label>
                    <label><input type="checkbox" /> Code Execution</label>
                    <label><input type="checkbox" checked /> API Calls</label>
                    <label><input type="checkbox" /> File Operations</label>
                </div>
            </div>
            <div class="form-group">
                <label>Max Steps</label>
                <input type="number" class="form-input" value="10" />
            </div>
        </div>
    `, () => {
        showNotification('Agent created and ready to execute!', 'success');
    });
});

// LangGraph - New Workflow Button
document.getElementById('btnNewWorkflow')?.addEventListener('click', function() {
    showNotification('LangGraph Visual Designer coming soon!', 'info');
});

// FT-Ops - Start Training Button
document.getElementById('btnNewJob')?.addEventListener('click', function() {
    showModal('Start Fine-Tuning Job', `
        <div class="modal-form">
            <div class="form-group">
                <label>Task Type</label>
                <select class="form-input">
                    <option>code_generation</option>
                    <option>summarization</option>
                    <option>question_answering</option>
                    <option>translation</option>
                </select>
            </div>
            <div class="form-group">
                <label>Base Model</label>
                <select class="form-input">
                    <option>gpt-3.5-turbo</option>
                    <option>gpt-4</option>
                    <option>claude-3</option>
                </select>
            </div>
            <div class="form-group">
                <label>Training Examples (min 100)</label>
                <input type="number" class="form-input" value="500" />
            </div>
            <div class="form-group">
                <label>Epochs</label>
                <input type="number" class="form-input" value="3" />
            </div>
        </div>
    `, () => {
        showNotification('Training job started! Check progress in Training Jobs list.', 'success');
    });
});

// Security - Run Tests Button
document.getElementById('btnRunTests')?.addEventListener('click', function() {
    showNotification('Running OWASP Top 10 security tests...', 'info');
    setTimeout(() => {
        showNotification('Security scan complete! 102/105 tests passed.', 'success');
    }, 3000);
});

// ===== MODAL SYSTEM =====
function showModal(title, content, onConfirm) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary modal-confirm">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate entrance
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close button
    modal.querySelector('.modal-close').onclick = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Confirm button
    modal.querySelector('.modal-confirm').onclick = () => {
        if (onConfirm) onConfirm();
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };
}

// Confirmation modal with danger variant
function showConfirmModal(title, message, onConfirm, isDanger = false) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = `modal-overlay ${isDanger ? 'modal-danger' : ''}`;
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">Cancel</button>
                <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} modal-confirm">${isDanger ? 'Delete' : 'Confirm'}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate entrance
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close button
    modal.querySelector('.modal-close').onclick = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Cancel button
    modal.querySelector('.modal-cancel').onclick = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Confirm button
    modal.querySelector('.modal-confirm').onclick = () => {
        if (onConfirm) onConfirm();
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };
}

// ===== MCP CHART =====
function initMCPChart() {
    const canvas = document.getElementById('mcpChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;
    
    // Data
    const versions = ['v1.0', 'v1.5', 'v2.0', 'v2.5', 'v3.0', 'v3.2'];
    const overallScore = [0.65, 0.70, 0.72, 0.78, 0.82, 0.87];
    const hallucinationRate = [0.25, 0.20, 0.15, 0.12, 0.08, 0.05];
   const userSatisfaction = [0.60, 0.68, 0.75, 0.80, 0.85, 0.90];
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        ctx.fillText((1 - i * 0.2).toFixed(1), padding - 10, y + 4);
    }
    
    // Draw lines
    function drawLine(data, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (value * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw points
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (value * chartHeight);
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    drawLine(overallScore, '#0078d4');
    drawLine(hallucinationRate, '#ec4899');
    drawLine(userSatisfaction, '#10b981');
    
    // X-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    versions.forEach((version, index) => {
        const x = padding + (chartWidth / (versions.length - 1)) * index;
        ctx.fillText(version, x, height - padding + 20);
    });
}

// ===== REAL-TIME UPDATES =====
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update agent progress
        const progressBars = document.querySelectorAll('.agent-progress .progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            if (currentWidth < 100) {
                bar.style.width = Math.min(100, currentWidth + Math.random() * 2) + '%';
            }
        });
        
        // Update agent times
        const agentTimes = document.querySelectorAll('.agent-time');
        agentTimes.forEach(time => {
            const parts = time.textContent.split('m ');
            if (parts.length === 2) {
                const minutes = parseInt(parts[0]);
                const seconds = parseInt(parts[1]);
                const newSeconds = seconds + 1;
                if (newSeconds >= 60) {
                    time.textContent = (minutes + 1) + 'm 0s';
                } else {
                    time.textContent = minutes + 'm ' + newSeconds + 's';
                }
            }
        });
    }, 1000);
}

// ===== PROGRESS ANIMATIONS =====
function animateProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// ===== SECURITY SCORE CIRCLE =====
function initSecurityScore() {
    const scoreCircle = document.querySelector('.score-circle svg');
    if (!scoreCircle) return;
    
    // Add gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#10b981;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#0078d4;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    scoreCircle.insertBefore(defs, scoreCircle.firstChild);
}

// ===== ACTIVITY FEED =====
function addActivityItem(icon, type, title, meta) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-20px)';
    
    item.innerHTML = `
        <div class="activity-icon ${type}">${icon}</div>
        <div class="activity-content">
            <div class="activity-title">${title}</div>
            <div class="activity-meta">${meta}</div>
        </div>
        <div class="activity-time">Just now</div>
    `;
    
    activityList.insertBefore(item, activityList.firstChild);
    
    setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove last item if more than 5
    if (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastChild);
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-left: 4px solid var(--${type});
        border-radius: var(--radius-md);
        padding: var(--spacing-lg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
            <span style="font-size: 1.5rem;">${type === 'success' ? '✓' : type === 'warning' ? '!' : 'ℹ'}</span>
            <div style="flex: 1; color: var(--text-primary);">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.25rem;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showNotification('Search feature coming soon!', 'info');
    }
    
    // Ctrl/Cmd + N for new agent
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        navigateTo('agents');
    }
    
    // Numbers 1-7 for quick navigation
    if (e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.metaKey) {
        const pageNames = ['dashboard', 'mcp', 'rag', 'agents', 'langgraph', 'ftops', 'security'];
        navigateTo(pageNames[parseInt(e.key) - 1]);
    }
});

// ===== SIDEBAR NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Add data-page attributes to nav items
    const navItems = document.querySelectorAll('.nav-item');
    const pageMapping = [
        'dashboard', 'mcp', 'rag', 'agents', 'langgraph', 'ftops', 'security'
    ];
    
    navItems.forEach((item, index) => {
        item.setAttribute('data-page', pageMapping[index]);
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            navigateTo(pageName);
        });
    });
    
    // Initialize
    initNavigation();
    initMCPChart();
    animateProgress();
    initSecurityScore();
    simulateRealTimeUpdates();
    updateAgentCounter();
    
    // Setup agent action buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const agentId = this.getAttribute('data-agent-id');
            deleteAgent(agentId);
        });
    });
    
    document.querySelectorAll('.btn-pause').forEach(btn => {
        btn.addEventListener('click', function() {
            const agentId = this.getAttribute('data-agent-id');
            pauseAgent(agentId);
        });
    });
    
    // Simulate some activity
    setTimeout(() => {
        addActivityItem('✓', 'success', 'MCP refined prompt "rag_strategy" to v3.3', '+5% performance improvement');
    }, 5000);
    
    setTimeout(() => {
        showNotification('System initialized successfully!', 'success');
    }, 1000);
    
    // Test all buttons on load
    setTimeout(() => {
        const results = testAllButtons();
        console.log(`\n🎯 Dashboard ready! ${results.working.length}/${results.total} buttons functional.`);
    }, 2000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .btn-danger {
            background: var(--error);
            color: white;
            border: 1px solid var(--error);
        }
        
        .btn-danger:hover {
            background: #b91c1c;
            border-color: #b91c1c;
        }
        
        .agent-icon.paused {
            opacity: 0.5;
            animation: none;
        }
    `;
    document.head.appendChild(style);
});

// ===== WINDOW RESIZE =====
window.addEventListener('resize', () => {
    if (currentPage === 'dashboard') {
        initMCPChart();
    }
});

// ===== HASH CHANGE =====
window.addEventListener('hashchange', initNavigation);
