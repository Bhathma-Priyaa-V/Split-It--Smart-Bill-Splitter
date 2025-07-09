// Adds a new name input field
function addNameField() {
  const container = document.getElementById('names-container');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter name';
  input.className = 'name-input';
  container.appendChild(input);
}

// Transition from name input section to expense input section
function goToSplit() {
  const nameInputs = document.querySelectorAll('.name-input');
  const names = [];

  nameInputs.forEach(input => {
    const name = input.value.trim();
    if (name) names.push(name);
  });

  if (names.length < 2) {
    alert("Please enter at least 2 names to continue.");
    return;
  }

  // Hide setup, show split section
  document.getElementById("setup-section").style.display = "none";
  document.getElementById("split-section").style.display = "block";

  // Create input fields for each person's expense
  const form = document.getElementById("expense-form");
  form.innerHTML = ""; // Clear any previous content

  names.forEach(name => {
    const label = document.createElement("label");
    label.textContent = `${name} paid: ₹`;

    const input = document.createElement("input");
    input.type = "number";
    input.name = name;
    input.placeholder = "0";
    input.min = "0";
    input.value = "0";

    form.appendChild(label);
    form.appendChild(input);
  });

  // Store names for reference
  window.participantNames = names;
}

// Perform the calculation: who owes whom
function calculateSplit() {
  const inputs = document.querySelectorAll("#expense-form input");
  const people = [];

  inputs.forEach(input => {
    const name = input.name;
    const paid = parseFloat(input.value) || 0;
    people.push({ name, paid });
  });

  const total = people.reduce((sum, p) => sum + p.paid, 0);
  const share = total / people.length;

  const balances = people.map(p => ({
    name: p.name,
    balance: Math.round((p.paid - share) * 100) / 100
  }));

  let output = "<strong>💬 Who owes whom:</strong><ul>";
  const debtors = balances.filter(p => p.balance < 0);
  const creditors = balances.filter(p => p.balance > 0);

  debtors.forEach(debtor => {
    let owed = -debtor.balance;

    creditors.forEach(creditor => {
      if (owed > 0 && creditor.balance > 0) {
        const amount = Math.min(owed, creditor.balance);
        if (amount > 0.01) {
          output += `<li><b>${debtor.name}</b> owes <b>${creditor.name}</b> ₹${amount.toFixed(2)}</li>`;
          debtor.balance += amount;
          creditor.balance -= amount;
          owed -= amount;
        }
      }
    });
  });

  output += "</ul>";
  document.getElementById("result").innerHTML = output;
    // Chart + Tip
  const values = people.map(p => p.paid);
  const labels = people.map(p => p.name);
  drawChart(values, labels);
  showRandomTip();

}

// Restart the app
function startOver() {
  document.getElementById("setup-section").style.display = "block";
  document.getElementById("split-section").style.display = "none";
  document.getElementById("names-container").innerHTML = "";

  // Reset result
  document.getElementById("result").innerHTML = "";

  // Add 2 default fields again
  addNameField();
  addNameField();
}

// Initialize with 2 input fields
window.onload = () => {
  addNameField();
  addNameField();
};
// 🌓 Theme Switcher
function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

// 💬 Random Tip Generator
function showRandomTip() {
  const tips = [
    "Tip: Always agree on expenses before the trip!",
    "Tip: Use UPI/Paytm to instantly settle!",
    "Tip: One person can pay and rest can split later.",
    "Tip: Rotate who pays next time to keep it fair!",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const tipBox = document.createElement('p');
  tipBox.innerHTML = `<em>${tip}</em>`;
  document.getElementById("result").appendChild(tipBox);
}

// 📊 Draw Pie Chart
function drawChart(dataArr, labelsArr) {
  document.getElementById("chart-section").style.display = "block";
  const ctx = document.getElementById('splitChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labelsArr,
      datasets: [{
        label: 'Amount Paid',
        data: dataArr,
        backgroundColor: [
          '#1B9CFC', '#FFC300', '#e74c3c', '#58B19F',
          '#8e44ad', '#f39c12', '#3498db', '#2ecc71'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: false
}
  });
}
