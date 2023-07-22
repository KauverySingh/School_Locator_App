// Handle form submission
document.getElementById("searchForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get the pincode entered by the user
    const pincode = document.getElementById("pincode").value;
    
    // Fetch school data from data.json
    fetchSchoolData(pincode);
});

// Fetch school data from data.json
function fetchSchoolData(pincode) {
    // Clear previous results
    document.getElementById("schoolList").innerHTML = "Loading...";
    
    
    // Make a request to fetch the data.json file
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const schools = data.schools;
            
            // Filter schools based on the pincode
            const matchedSchools = schools.filter(school => school.pincode === pincode);
            
            if (matchedSchools.length > 0) {
                const efficientOrder = tspSearch(matchedSchools);
                displaySchools(matchedSchools, efficientOrder);
            } else {
                const content1 = "<p>No schools found for the given pincode.</p>"
                const styledContent1 = `<div style="color: #ffffff; padding: auto; margin: auto">${content1}</div>`;
                document.getElementById("schoolList").innerHTML = styledContent1;
                schoolList.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error("Error fetching school data:", error);
		const content2 = "<p>An error occurred while fetching school data.</p>"
                const styledContent2 = `<div style="color: #ffffff; padding: auto; margin: auto">${content2}</div>`;
            document.getElementById("schoolList").innerHTML = styledContent2;
            schoolList.classList.remove('hidden');
        });
}

// Display the list of schools
function displaySchools(schools, efficientOrder) {
    const schoolList = document.getElementById("schoolList");
    schoolList.innerHTML = "";
    
    // Display efficient order
    const efficientOrderHeader = document.createElement("h3");
    efficientOrderHeader.textContent = "Efficient Order:";
    schoolList.appendChild(efficientOrderHeader);
    
    const efficientOrderList = document.createElement("ul");
    efficientOrder.forEach(city => {
        const listItem = document.createElement("li");
        listItem.textContent = city.name;
        efficientOrderList.appendChild(listItem);
    });
    schoolList.appendChild(efficientOrderList);
    
    // Display schools
    const schoolsHeader = document.createElement("h3");
    schoolsHeader.textContent = "Schools:";
    schoolList.appendChild(schoolsHeader);
    
    const schoolsList = document.createElement("ul");
    schools.forEach(school => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${school.name}</strong><br>
            Address: ${school.street+', '+school.locality+', '+school.city+', '+school.district+', '+school.state}<br>
            Pincode: ${school.pincode}
        `;
        schoolsList.appendChild(listItem);
    });
    schoolList.appendChild(schoolsList);
    schoolList.classList.remove('hidden');
}

// TSP algorithm - Nearest Neighbor
function tspSearch(schools) {
    const cities = schools.map((school, index) => ({
        name: school.name,
        x: index,
        y: index,
    }));

    const unvisitedCities = [...cities];
    const path = [];
    let currentCity = cities[0];

    path.push(currentCity);
    unvisitedCities.splice(unvisitedCities.indexOf(currentCity), 1);

    while (unvisitedCities.length > 0) {
        const nearestNeighbor = findNearestNeighbor(currentCity, unvisitedCities);

        path.push(nearestNeighbor);
        unvisitedCities.splice(unvisitedCities.indexOf(nearestNeighbor), 1);
        currentCity = nearestNeighbor;
    }

    // Return to the starting city
    path.push(path[0]);

    return path;
}

// Calculate Euclidean distance between two cities
function calculateDistance(x1, y1, x2, y2) {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

// Find the nearest unvisited city
function findNearestNeighbor(currentCity, unvisitedCities) {
    let nearestNeighbor = null;
    let shortestDistance = Infinity;

    for (const city of unvisitedCities) {
        const distance = calculateDistance(currentCity.x, currentCity.y, city.x, city.y);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestNeighbor = city;
        }
    }

    return nearestNeighbor;
}




const card = document.querySelector('.card');

card.addEventListener('mousemove', handleMouseMove);
card.addEventListener('mouseleave', resetAnimation);

function handleMouseMove(event) {
  const { clientX, clientY } = event;
  const cardRect = card.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  const percentX = (clientX - cardCenterX) / (cardRect.width / 2);
  const percentY = (clientY - cardCenterY) / (cardRect.height / 2);
  const rotationAngleX = 10 * percentX;
  const rotationAngleY = 10 * percentY;
  //const scaleValue = 1.1 - Math.abs(percentX) * 0.1;

  card.style.transform = `perspective(1000px) rotateY(${rotationAngleX}deg) rotateX(${rotationAngleY}deg)`;
}

function resetAnimation() {
  card.style.transform = 'none';
}




