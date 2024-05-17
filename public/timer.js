const { ipcRenderer } = require('electron');

window.onload = () => {
    ipcRenderer.on('start-timer', (event, timerData) => {
        const { timer, task, date, employees } = timerData;
        const endtime = new Date(date + " " + timer);
        startTimer(endtime);

        const taskContainer = document.getElementById('tasko');
        taskContainer.innerHTML = `Task: ${task}<br/>Employees: ${employees.join(', ')}`;
    });
}

function startTimer(endtime) {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    setInterval(() => {
        const currenttime = new Date();
        const days = document.getElementById('countdown-days');
        const hours = document.getElementById('countdown-hours');
        const minutes = document.getElementById('countdown-minutes');
        const seconds = document.getElementById('countdown-seconds');

        if (endtime > currenttime) {
            const timeleft = (endtime - currenttime) / 1000;
            days.innerText = Math.floor(timeleft / (24 * 60 * 60));
            hours.innerText = Math.floor((timeleft / (60 * 60)) % 24);
            minutes.innerText = Math.floor((timeleft / 60) % 60);
            seconds.innerText = Math.floor(timeleft % 60);
        } else {
            modal.style.display = 'none';
            alert('Time is up!');
        }
    }, 1000);
}






