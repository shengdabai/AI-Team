document.addEventListener('DOMContentLoaded', function() {
    const timelineData = [
        { year: '1930', title: 'Born in Gastonia, NC', description: 'Thomas Sowell was born in Gastonia, North Carolina, on June 30, during the Great Depression.' },
        { year: '1958', title: 'Graduates Harvard University', description: 'Graduated magna cum laude with a Bachelor of Arts degree in Economics from Harvard University.' },
        { year: '1959', title: 'M.A. from Columbia University', description: 'Received his Master of Arts in Economics from Columbia University.' },
        { year: '1968', title: 'Ph.D. from University of Chicago', description: 'Earned his Ph.D. in Economics from the University of Chicago, studying under Milton Friedman and George Stigler.' },
        { year: '1977', title: 'Joins Hoover Institution', description: 'Became a Senior Fellow at the Hoover Institution at Stanford University, a position he has held for decades.' },
        { year: '1980', title: 'Publication: "Knowledge and Decisions"', description: 'Published one of his seminal works, "Knowledge and Decisions," which won the Law and Economics Center Prize.' },
        { year: '1987', title: 'Publication: "A Conflict of Visions"', description: 'Published "A Conflict of Visions: Ideological Origins of Political Struggles," another highly influential book.' },
        { year: '2002', title: 'Awarded National Humanities Medal', description: 'Awarded the National Humanities Medal for his scholarly work in economics, history, and social policy.' }
    ];

    const timelineContainer = document.getElementById('timeline');
    // Clear any existing placeholder content within the timeline section, except the H2
    const heading = timelineContainer.querySelector('h2');
    timelineContainer.innerHTML = ''; // Clear all content
    if (heading) {
        timelineContainer.appendChild(heading); // Add back the heading
    }


    timelineData.forEach(eventData => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('timeline-event');

        const yearDiv = document.createElement('div');
        yearDiv.classList.add('timeline-year');
        yearDiv.textContent = eventData.year;

        const titleH3 = document.createElement('h3');
        titleH3.textContent = eventData.title;

        const descriptionP = document.createElement('p');
        descriptionP.textContent = eventData.description;

        eventDiv.appendChild(yearDiv); // Year is often styled separately or part of title
        eventDiv.appendChild(titleH3);
        eventDiv.appendChild(descriptionP);

        timelineContainer.appendChild(eventDiv);
    });
});
