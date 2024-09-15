document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const sessionSelect = document.getElementById('sessionSelect');
    const studentList = document.getElementById('studentList');

    if (!studentForm || !sessionSelect || !studentList) {
        console.error('Một hoặc nhiều phần tử không tồn tại.');
        return;
    }

    // Tải danh sách phiên điểm danh để người dùng chọn
    function loadSessions() {
        fetch('http://localhost:3000/sessions')  // Địa chỉ API lấy danh sách phiên điểm danh
            .then(response => response.json())
            .then(data => {
                sessionSelect.innerHTML = '<option value="">-- Chọn phiên --</option>';
                data.forEach(session => {
                    const option = document.createElement('option');
                    option.value = session.id;
                    option.textContent = `${session.className} - ${new Date(session.dateTime).toLocaleString()}`;
                    sessionSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Lỗi khi tải các phiên:', error));
    }

    // Thêm học sinh mới
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(studentForm);
        const studentData = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            sessionId: formData.get('sessionId')
        };

        fetch('http://localhost:3000/students', {  // Địa chỉ API thêm học sinh
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Mạng phản hồi không ổn định');
            }
            return response.json();
        })
        .then(data => {
            loadStudents(); // Cập nhật danh sách học sinh sau khi thêm
            studentForm.reset(); // Xóa dữ liệu form sau khi thêm
        })
        .catch(error => {
            console.error('Lỗi khi thêm học sinh:', error);
        });
    });

    // Hàm xóa học sinh
    function deleteStudent(studentId) {
        fetch(`http://localhost:3000/students/${studentId}`, {  // Địa chỉ API xóa học sinh
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Mạng phản hồi không ổn định');
            }
            loadStudents(); // Cập nhật danh sách sau khi xóa
        })
        .catch(error => {
            console.error('Lỗi khi xóa học sinh:', error);
        });
    }

    // Tải danh sách học sinh
    function loadStudents() {
        fetch('http://localhost:3000/students')  // Địa chỉ API lấy danh sách học sinh
            .then(response => response.json())
            .then(data => {
                let tableHtml = `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Ngày Sinh</th>
                                <th>Giới Tính</th>
                                <th>Địa Chỉ</th>
                                <th>Số Điện Thoại</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.forEach(student => {
                    tableHtml += `
                        <tr>
                            <td>${student.name}</td>
                            <td>${new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td>${student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                            <td>${student.address}</td>
                            <td>${student.phone}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">Xóa</button>
                            </td>
                        </tr>
                    `;
                });

                tableHtml += `
                        </tbody>
                    </table>
                `;
                
                studentList.innerHTML = tableHtml;
            })
            .catch(error => console.error('Lỗi khi tải danh sách học sinh:', error));
    }

    // Tải các phiên điểm danh và danh sách học sinh khi trang được nạp
    loadSessions();
    loadStudents();

    // Đảm bảo hàm deleteStudent có thể truy cập toàn cục
    window.deleteStudent = deleteStudent;
});
