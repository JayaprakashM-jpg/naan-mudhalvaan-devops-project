// Student data storage
let students = [];

// Load students from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupNavigation();
});

function loadStudents() {
    const stored = localStorage.getItem('students');
    if (stored) {
        students = JSON.parse(stored);
    }
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function setupNavigation() {
    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function showAdmissionForm() {
    document.getElementById('admission-form').style.display = 'block';
    document.getElementById('student-list').style.display = 'none';
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

function hideAdmissionForm() {
    document.getElementById('admission-form').style.display = 'none';
    document.getElementById('studentForm').reset();
}

function showStudentList() {
    displayStudents();
    document.getElementById('student-list').style.display = 'block';
    document.getElementById('admission-form').style.display = 'none';
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

function hideStudentList() {
    document.getElementById('student-list').style.display = 'none';
}

function displayStudents() {
    const container = document.getElementById('studentsTable');
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align: center;">No students registered yet.</p>';
        return;
    }
    
    let html = '<table>';
    html += `
        <thead>
            <tr><th>Name</th><th>Address</th><th>Age</th><th>Qualification</th><th>Percentage</th><th>Year</th></tr>
        </thead>
        <tbody>
    `;
    
    students.forEach(student => {
        html += `
            <tr>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.address)}</td>
                <td>${student.age}</td>
                <td>${student.qualification}</td>
                <td>${student.percentage}%</td>
                <td>${student.year}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle form submission
document.getElementById('studentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const student = {
        id: Date.now(),
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        age: parseInt(document.getElementById('age').value),
        qualification: document.getElementById('qualification').value,
        percentage: parseFloat(document.getElementById('percentage').value),
        year: parseInt(document.getElementById('year').value),
        registeredAt: new Date().toISOString()
    };
    
    students.push(student);
    saveStudents();
    
    alert(`✅ Student ${student.name} has been successfully registered!`);
    
    e.target.reset();
    hideAdmissionForm();
    
    // Console log for Jenkins build verification
    console.log(`[Jenkins Build] New student registered: ${student.name} at ${student.registeredAt}`);
});