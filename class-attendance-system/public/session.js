document.addEventListener('DOMContentLoaded', function() {
    const sessionForm = document.getElementById('sessionForm');
    const sessionList = document.getElementById('sessionList');
    const studentList = document.getElementById('studentList');

    if (!sessionForm || !sessionList || !studentList) {
        console.error('Một hoặc nhiều phần tử không tồn tại.');
        return;
    }

    function loadSessions() {
        fetch('http://localhost:3000/sessions')
            .then(response => response.json())
            .then(data => {
                sessionList.innerHTML = '';
                data.forEach(session => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = `
                        ${session.className} - ${new Date(session.dateTime).toLocaleString()}
                        <button class="btn btn-danger btn-sm float-end ms-2 delete-btn" data-id="${session.id}">Xóa</button>
                        <button class="btn btn-info btn-sm float-end show-students-btn" data-id="${session.id}">Xem Học Sinh</button>
                    `;
                    sessionList.appendChild(li);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const sessionId = this.getAttribute('data-id');
                        if (sessionId) {
                            deleteSession(sessionId);
                        } else {
                            console.error('Session ID is undefined');
                        }
                    });
                });

                document.querySelectorAll('.show-students-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const sessionId = this.getAttribute('data-id');
                        if (sessionId) {
                            showStudents(sessionId);
                        } else {
                            console.error('Session ID is undefined');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error loading sessions:', error);
            });
    }

    function deleteSession(sessionId) {
        fetch(`http://localhost:3000/sessions/${sessionId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadSessions(); // Cập nhật danh sách sau khi xóa
        })
        .catch(error => {
            console.error('Error deleting session:', error);
        });
    }

    function showStudents(sessionId) {
        fetch(`http://localhost:3000/sessions/${sessionId}`)
            .then(response => response.json())
            .then(session => {
                const students = session.students;
                const tableHtml = students.length > 0 ? 
                    `<table class="table table-striped student-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Ngày Sinh</th>
                                <th>Địa Chỉ</th>
                                <th>Điện Thoại</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(student => `
                                <tr>
                                    <td>${student.name}</td>
                                    <td>${student.dateOfBirth || 'N/A'}</td>
                                    <td>${student.address || 'N/A'}</td>
                                    <td>${student.phone || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`
                 : '<p>Không có học sinh.</p>';
                studentList.innerHTML = `
                    <h3>Danh Sách Học Sinh của Phiên</h3>
                    ${tableHtml}
                `;
            })
            .catch(error => {
                console.error('Error loading students:', error);
            });
    }

    sessionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(sessionForm);
        const sessionData = {
            className: formData.get('className'),
            dateTime: formData.get('dateTime'),
            students: [] // Danh sách học sinh có thể được cập nhật sau
        };

        fetch('http://localhost:3000/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadSessions(); // Cập nhật danh sách sau khi thêm
            sessionForm.reset(); // Xóa dữ liệu trong form sau khi thêm
        })
        .catch(error => {
            console.error('Error adding session:', error);
        });
    });

    loadSessions();
});



