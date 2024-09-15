document.addEventListener('DOMContentLoaded', function() {
    const attendanceForm = document.getElementById('attendanceForm');
    const sessionSelect = document.getElementById('sessionSelect');
    const attendanceTable = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
    const statsContainer = document.getElementById('statsContainer');
    const exportButton = document.getElementById('exportButton');
    const importInput = document.getElementById('importInput');

    if (!attendanceForm || !sessionSelect || !attendanceTable || !statsContainer || !exportButton || !importInput) {
        console.error('Một hoặc nhiều phần tử không tồn tại.');
        return;
    }

    function loadSessions() {
        fetch('http://localhost:3000/sessions')
            .then(response => response.json())
            .then(data => {
                sessionSelect.innerHTML = '<option value="">-- Chọn Phiên --</option>';
                data.forEach(session => {
                    const option = document.createElement('option');
                    option.value = session.id;
                    option.textContent = `${session.className} - ${new Date(session.dateTime).toLocaleString()}`;
                    sessionSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải phiên:', error);
            });
    }

    function loadStudents(sessionId) {
        fetch(`http://localhost:3000/sessions/${sessionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Phản hồi mạng không ổn. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const students = data.students;
                const rows = students.map(student => {
                    return `<tr>
                                <td>${student.name}</td>
                                <td>
                                    <select class="form-select attendanceStatus">
                                        <option value="present">Đến</option>
                                        <option value="late">Đi Muộn</option>
                                        <option value="excused">Nghỉ Có Phép</option>
                                        <option value="unexcused">Nghỉ Không Phép</option>
                                    </select>
                                </td>
                            </tr>`;
                }).join('');
                attendanceTable.innerHTML = rows;
                loadAttendance(sessionId); // Tải điểm danh sau khi tải sinh viên
            })
            .catch(error => {
                console.error('Lỗi khi tải sinh viên:', error);
            });
    }

    function loadAttendance(sessionId) {
        fetch(`http://localhost:3000/sessions/${sessionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Phản hồi mạng không ổn. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const attendance = data.attendance.attendance; // Cập nhật đây là mảng bên trong đối tượng attendance
                const stats = {
                    present: 0,
                    late: 0,
                    excused: 0,
                    unexcused: 0
                };

                if (Array.isArray(attendance)) {
                    attendance.forEach(record => {
                        if (record.attendanceStatus in stats) {
                            stats[record.attendanceStatus]++;
                        }
                    });

                    statsContainer.innerHTML = ` 
                        <ul>
                            <li>Số học sinh đến: ${stats.present}</li>
                            <li>Số học sinh đi muộn: ${stats.late}</li>
                            <li>Số học sinh nghỉ có phép: ${stats.excused}</li>
                            <li>Số học sinh nghỉ không phép: ${stats.unexcused}</li>
                        </ul>
                    `;
                } else {
                    console.error('Dữ liệu điểm danh không phải là một mảng.');
                    statsContainer.innerHTML = 'Không có dữ liệu điểm danh.';
                }
            })
            .catch(error => {
                console.error('Lỗi khi tải điểm danh:', error);
            });
    }

    function exportToExcel() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(attendanceTable);

        XLSX.utils.book_append_sheet(wb, ws, 'Điểm Danh');
        XLSX.writeFile(wb, 'diem_danh.xlsx');
    }

    function importFromExcel(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Xóa các hàng bảng hiện tại
            attendanceTable.innerHTML = '';

            // Thêm dữ liệu từ file vào bảng
            rows.forEach((row, index) => {
                if (index === 0) return; // Bỏ qua hàng tiêu đề

                const [studentName, attendanceStatus] = row;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${studentName}</td>
                    <td>
                        <select class="form-select attendanceStatus">
                            <option value="present" ${attendanceStatus === 'Đến' ? 'selected' : ''}>Đến</option>
                            <option value="late" ${attendanceStatus === 'Đi Muộn' ? 'selected' : ''}>Đi Muộn</option>
                            <option value="excused" ${attendanceStatus === 'Nghỉ Có Phép' ? 'selected' : ''}>Nghỉ Có Phép</option>
                            <option value="unexcused" ${attendanceStatus === 'Nghỉ Không Phép' ? 'selected' : ''}>Nghỉ Không Phép</option>
                        </select>
                    </td>
                `;
                attendanceTable.appendChild(tr);
            });
        };
        reader.readAsArrayBuffer(file);
    }

    function handleImport(event) {
        const file = event.target.files[0];
        if (file) {
            importFromExcel(file);
        }
    }

    function saveAttendance(sessionId) {
        const rows = attendanceTable.getElementsByTagName('tr');
        const attendanceData = [];

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            if (cells.length > 1) {
                const studentName = cells[0].innerText;
                const attendanceStatus = cells[1].querySelector('.attendanceStatus').value;
                attendanceData.push({ studentName, attendanceStatus });
            }
        }

        fetch(`http://localhost:3000/sessions/${sessionId}/attendance`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ attendance: attendanceData })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Phản hồi mạng không ổn. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Điểm danh đã được lưu thành công:', data);
            loadAttendance(sessionId); // Cập nhật giao diện người dùng
        })
        .catch(error => {
            console.error('Lỗi khi lưu điểm danh:', error);
        });
    }

    attendanceForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const sessionId = sessionSelect.value;
        if (!sessionId) {
            console.error('Chưa chọn phiên điểm danh.');
            return;
        }

        saveAttendance(sessionId);
    });

    exportButton.addEventListener('click', function() {
        exportToExcel();
    });

    importInput.addEventListener('change', handleImport);

    sessionSelect.addEventListener('change', function() {
        const sessionId = this.value;
        if (sessionId) {
            loadStudents(sessionId);
        }
    });

    loadSessions();
});
