function giveTaux() {
  if (document.Saisie.duree.value == "30") {
    document.Saisie.tauxCredit.value = "1.50";
  } else if (document.Saisie.duree.value == "25") {
    document.Saisie.tauxCredit.value = "1.40";
  } else if (document.Saisie.duree.value == "20") {
    document.Saisie.tauxCredit.value = "1.25";
  } else if (document.Saisie.duree.value == "15") {
    document.Saisie.tauxCredit.value = "1.00";
  } else if (document.Saisie.duree.value == "10") {
    document.Saisie.tauxCredit.value = "0.8";
  } else if (document.Saisie.duree.value == "5") {
    document.Saisie.tauxCredit.value = "0.65";
  }
}

[
  anElement1,
  anElement2,
  anElement3,
  anElement4,
  anElement5,
  anElement6
] = AutoNumeric.multiple(
  [
    '[name="prixBien"]',
    '[name="fraisAgence"]',
    '[name="taxeFonciere"]',
    '[name="chargesAnnuelles"]',
    '[name="Apport"]',
    '[name="Location"]'
  ],
  {
    allowDecimalPadding: false,
    currencySymbol: "€",
    currencySymbolPlacement: "s",
    decimalCharacter: ",",
    decimalCharacterAlternative: ".",
    digitGroupSeparator: " ",
    outputFormat: "number"
  }
);

[
  anElement7,
  anElement8,
  anElement9,
  anElement10,
  anElement11
] = AutoNumeric.multiple(
  [
    '[name="tauxCredit"]',
    '[name="tauxAssurance"]',
    '[name="rendementEpargne"]',
    '[name="evolutionImmo"]',
    '[name="evolutionLoyer"]'
  ],
  {
    allowDecimalPadding: false,
    decimalCharacterAlternative: ",",
    suffixText: "%",
    symbolWhenUnfocused: ""
  }
);

function Mef(valeur) {
  return valeur.toFixed(1);
}

function clearBox(elementID) {
  document.getElementById(elementID).innerHTML = "";
}

function Calcul() {
  var prixBien = Number(
    document
      .querySelector('[name="prixBien"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(" ", "")
      .replace(",", ".")
  );

  var fraisAgence = Number(
    document
      .querySelector('[name="fraisAgence"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(",", ".")
  );
  var location = Number(
    document
      .querySelector('[name="Location"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(",", ".")
  );
  var taxeFonciere = Number(
    document
      .querySelector('[name="taxeFonciere"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(",", ".")
  );
  var chargesAnnuelles = Number(
    document
      .querySelector('[name="chargesAnnuelles"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(",", ".")
  );
  var apport = Number(
    document
      .querySelector('[name="Apport"]')
      .value.replace("€", "")
      .replace(" ", "")
      .replace(" ", "")
      .replace(",", ".")
  );

  var tauxCredit = Number(
    document
      .querySelector('[name="tauxCredit"]')
      .value.replace(",", ".")
      .replace("%", "")
  );
  var tauxAssurance = Number(
    document
      .querySelector('[name="tauxAssurance"]')
      .value.replace(",", ".")
      .replace("%", "")
  );
  var rendementEpargne = Number(
    document
      .querySelector('[name="rendementEpargne"]')
      .value.replace(",", ".")
      .replace("%", "")
  );
  var evolutionImmo = Number(
    document
      .querySelector('[name="evolutionImmo"]')
      .value.replace(",", ".")
      .replace("%", "")
  );
  var evolutionLoyer = Number(
    document
      .querySelector('[name="evolutionLoyer"]')
      .value.replace(",", ".")
      .replace("%", "")
  );

  var years = Number(document.Saisie.duree.value);

  var fraisDeNotaire = Math.floor(prixBien * 0.07);
  var montant = prixBien - apport + fraisDeNotaire + fraisAgence;

  // Gérer exceptions !

  if (montant < 0) {
    montant = 0;
  }

  var mensualite = Math.floor(
    (montant * (tauxCredit / 1200)) /
      (1 - Math.pow(1 + tauxCredit / 1200, -(years * 12))) +
      ((tauxAssurance / 100) * montant) / 12
  );

  var loyerActualise = new Array(years);
  loyerActualise.fill(0);
  loyerActualise[0] = location;

  for (var j = 1; j < years; j++) {
    loyerActualise[j] = loyerActualise[j - 1] * (1 + evolutionLoyer / 100);
  }

  var epargneMensuelle = new Array(years);
  for (var j = 0; j < years + 1; j++) {
    epargneMensuelle[j - 1] =
      mensualite -
      loyerActualise[j - 1] +
      chargesAnnuelles / 12 +
      taxeFonciere / 12;
  }

  console.log("EPARGNE");
  console.log(roundArray(epargneMensuelle));

  var loyerActualiseCumul = new Array(years);
  loyerActualiseCumul[0] = loyerActualise[0];
  for (i = 1; i < years; i++) {
    loyerActualiseCumul[i] = loyerActualise[i] + loyerActualiseCumul[i - 1];
  }

  console.log("Loyer CUMUL");
  console.log(loyerActualiseCumul);

  var epargneMensuelleCumul = new Array(years);
  if (epargneMensuelle[0] > 0) {
    epargneMensuelleCumul[0] = epargneMensuelle[0];
  } else {
    epargneMensuelleCumul[0] = 0;
  }

  for (i = 1; i < years; i++) {
    if (epargneMensuelle[i] > 0) {
      epargneMensuelleCumul[i] =
        epargneMensuelle[i] + epargneMensuelleCumul[i - 1];
    } else {
      epargneMensuelleCumul[i] = epargneMensuelleCumul[i - 1];
    }
  }

  console.log("Epargne CUMUL");
  console.log(epargneMensuelleCumul);

  var total = 0;
  for (var i = 0; i < years; i++) {
    total += epargneMensuelle[i];
  }
  var epargneMensuelleAverage = Math.round(total / years);

  console.log("epargneMensuelleAverage");
  console.log(Math.round(epargneMensuelleAverage));

  document.getElementById("montant_output").innerHTML =
    montant.toLocaleString("fr") + "€";
  document.getElementById("mensualite_output").innerHTML =
    mensualite.toLocaleString("fr") + "€";
  document.getElementById("fraisDeNotaire_output").innerHTML =
    fraisDeNotaire.toLocaleString("fr") + "€";

  var tableID = [];
  for (i = 0; i < years; i++) {
    tableID[i] = i + 1;
  }

  var capital = new Array(years);
  capital.fill(0);

  for (var i = 1; i < years + 1; i++) {
    for (var j = 1; j < 12 + 1; j++) {
      capital[i - 1] += Hypo.princPer(
        montant,
        years * 12,
        tauxCredit / 100 / 12,
        i * j,
        2
      );
    }
  }

  var interet = new Array(years);
  interet.fill(0);

  for (var i = 1; i < years + 1; i++) {
    for (var j = 1; j < 12 + 1; j++) {
      interet[i - 1] += Hypo.intPer(
        montant,
        years * 12,
        tauxCredit / 100 / 12,
        i * j,
        2
      );
    }
  }

  var assurance = new Array(years);
  assurance.fill(Math.round((tauxAssurance / 100) * montant));

  var restant = new Array(years);
  restant.fill(0);

  for (var i = 1; i < years + 1; i++) {
    restant[i - 1] = Hypo.SRDPn_K(
      montant,
      years * 12,
      tauxCredit / 100 / 12,
      12 * i,
      2
    );
  }

  function roundArray(myArray) {
    for (var i = 0; i < years; i++) {
      myArray[i] = parseFloat(myArray[i].toFixed(1));
    }
    return myArray;
  }

  var tableAmort = [
    tableID,
    roundArray(capital),
    roundArray(interet),
    assurance,
    roundArray(restant)
  ];

  Array.prototype.transpose = function() {
    var a = this,
      w = a.length ? a.length : 0,
      h = a[0] instanceof Array ? a[0].length : 0;

    if (h === 0 || w === 0) {
      return [];
    }

    var t = [];
    for (i = 0; i < h; i++) {
      t[i] = [];
      for (j = 0; j < w; j++) {
        t[i][j] = a[j][i].toLocaleString("fr");
      }
    }
    return t;
  };

  var mensualiteTotal = parseFloat((mensualite * years * 12).toFixed(1));
  var interetTotal = parseFloat((mensualiteTotal - montant).toFixed(1));
  var assuranceTotal = parseFloat(
    ((tauxAssurance / 100) * montant * years).toFixed(1)
  );
  var total = parseFloat((mensualiteTotal + assuranceTotal).toFixed(1));

  var cumulInteret = new Array(years);
  cumulInteret.fill(0);
  cumulInteret[0] = interet[0];

  for (var j = 1; j < years; j++) {
    cumulInteret[j] = interet[j] + cumulInteret[j - 1];
  }

  var depense = new Array(years);
  depense.fill(0);

  for (var i = 1; i < years + 1; i++) {
    depense[i - 1] =
      (fraisDeNotaire +
        fraisAgence +
        taxeFonciere * i +
        chargesAnnuelles * i +
        assurance[i - 1] * i +
        cumulInteret[i - 1]) /
      (12 * i);
  }

  var cumulCapital = new Array(years);
  cumulCapital.fill(0);
  cumulCapital[0] = capital[0];

  for (var j = 1; j < years; j++) {
    cumulCapital[j] = capital[j] + cumulCapital[j - 1];
  }

  var epargne = new Array(years);
  epargne.fill(0);

  for (var i = 1; i < years + 1; i++) {
    epargne[i - 1] = cumulCapital[i - 1] / (12 * i);
  }

  var difference = new Array(years);
  for (var i = 0; i < years + 1; i++) {
    difference[i] = epargne[i] - depense[i];
  }

  var comparaison = [
    tableID,
    roundArray(depense),
    roundArray(epargne),
    roundArray(difference),
    roundArray(depense),
    roundArray(epargne),
    roundArray(loyerActualise),
    roundArray(epargneMensuelle)
  ];

  var valeurBien = new Array(years);
  valeurBien.fill(0);

  for (var j = 0; j < years + 1; j++) {
    valeurBien[j - 1] = Hypo.VC_K(prixBien, j, evolutionImmo / 100, 2);
  }

  var capitalAchat = new Array(years);
  capitalAchat.fill(0);

  var epargneCumulAchat = new Array(years); // épargne supplémentaire si propriétaire et loyer > mensualité
  epargneCumulAchat.fill(0);

  if (epargneMensuelle[0] > 0) {
    epargneCumulAchat[0] = 0;
  } else {
    epargneCumulAchat[0] = epargneMensuelle[0] * -12;
  }

  for (var i = 1; i < years; i++) {
    if (epargneMensuelle[i] > 0) {
      epargneCumulAchat[i] = epargneCumulAchat[i - 1];
    } else {
      epargneCumulAchat[i] =
        epargneCumulAchat[i - 1] + epargneMensuelle[i] * -12;
    }
  }
  console.log("CUMUL ACHAT");
  console.log(epargneCumulAchat);

  for (var i = 0; i < years; i++) {
    capitalAchat[i] = Math.round(
      valeurBien[i] - restant[i] + epargneCumulAchat[i]
    );
  }

  console.log("ACHAT");
  console.log(roundArray(capitalAchat));

  var capitalLocation = new Array(years);
  capitalLocation.fill(0);
  if (epargneMensuelle[j - 1] > 0) {
    capitalLocation[0] = Math.round(
      apport * (1 + rendementEpargne / 100) + epargneMensuelle[0] * 12
    );
  } else {
    capitalLocation[0] = Math.round(apport * (1 + rendementEpargne / 100));
  }

  for (var j = 2; j < years + 1; j++) {
    if (epargneMensuelle[j - 1] > 0) {
      capitalLocation[j - 1] = Math.round(
        capitalLocation[j - 2] * (1 + rendementEpargne / 100) +
          epargneMensuelle[j - 1] * 12
      );
    } else {
      capitalLocation[j - 1] = Math.round(
        capitalLocation[j - 2] * (1 + rendementEpargne / 100)
      );
    }
  }

  console.log("LOCATION");
  console.log(roundArray(capitalLocation));

  var differencePatrimoine = new Array(years);
  for (var i = 0; i < years; i++) {
    differencePatrimoine[i] = capitalAchat[i] - capitalLocation[i];
  }

  clearBox("chartPatrimoine");

  var options = {
    chart: {
      type: "line"
    },
    chart: {
      toolbar: {
        show: false
      }
    },
    series: [
      {
        name: "Capital Achat",
        data: capitalAchat
      },
      {
        name: "Capital Location",
        data: capitalLocation
      }
    ],
    xaxis: {
      type: "category",
      categories: tableID,
      type: "category",
      categories: [],
      labels: {
        show: true,
        style: {
          fontSize: "15px"
        }
      },

      tickAmount: undefined,
      tickPlacement: "between",
      min: undefined,
      max: undefined,
      range: undefined,
      floating: false,
      position: "bottom"
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "15px"
        }
      }
    },

    grid: {
      show: false
    },

    colors: ["#4cbb7a", "#3BB0EF"],
    legend: {
      fontSize: "15px"
    }
  };

  var chartPatrimoine = new ApexCharts(
    document.querySelector("#chartPatrimoine"),
    options
  );

  chartPatrimoine.render();

  var pointZero = 0;
  for (var i = 0; i < years; i++) {
    if (capitalAchat[i] > capitalLocation[i]) {
      pointZero = i + 1;
      break;
    } else {
      pointZero = 0;
    }
  }

  if (pointZero == 0) {
    document.getElementById("pointZero").innerHTML =
      "L'achat n'est pas plus intéressant que la location.";
  } else {
    document.getElementById("pointZero").innerHTML =
      "L'achat devient plus intéressant" +
      "<br>" +
      "que la location à partir de : " +
      "<br>" +
      "<mark>" +
      pointZero +
      " ans." +
      "</mark>";
  }

  document.getElementById("rs-range-line").max = years;
  document.getElementById("max_range").innerHTML = years;

  var rangeSlider = document.getElementById("rs-range-line");
  var rangeBullet = document.getElementById("rs-bullet");

  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = rangeSlider.value / rangeSlider.max;
  rangeBullet.style.left = bulletPosition * 578 + "px";

  var explication_bottom =
    "L'<strong>achat</strong> immobilier permet de rembourser tous les mois une part de capital par le paiement d'une mensualité : " +
    "<mark>" +
    Math.round(
      epargne[rangeSlider.value - 1] +
        epargneCumulAchat[rangeSlider.value - 1] / (12 * rangeSlider.value)
    ) + // attention, ajouter if / else !
    "€" +
    "</mark>" +
    "<br>" +
    "Ce remboursement de capital n'est pas gratuit, puisque l'achat induit des frais (notaire, agence, intérêts, assurance, entretien, charges, taxe foncière) : " +
    "<mark>" +
    Math.round(depense[rangeSlider.value - 1]) +
    "€" +
    "</mark>" +
    "<br>" +
    "<br>" +
    "De son côté, le <strong>locataire</strong> dépense tous les mois un loyer : " +
    "<mark>" +
    Math.round(loyerActualiseCumul[rangeSlider.value - 1] / rangeSlider.value) +
    "€" +
    "</mark>" +
    "<br>";
  if (epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value > 0) {
    explication_bottom +=
      "Ce loyer est souvent inférieur au montant de la mensualité et des frais que le propriétaire paye lors d'un achat." +
      "<br>" +
      "Cette différence lui permet d'épargner tous les mois : " +
      "<mark>" +
      Math.round(
        epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value
      ) +
      "€" +
      "</mark>";
  } else {
    explication_bottom +=
      "Le loyer est souvent inférieur au montant de la mensualité et des frais que le propriétaire paye lors d'un achat." +
      "<br>" +
      "Sauf dans cette configuration où le locataire n'épargne pas mensuellement le différentiel.";
  }

  document.getElementById("explication_bottom").innerHTML = explication_bottom;

  var table_comparaison_duree = "<table>";
  table_comparaison_duree +=
    "<thead><tr><th></th><th>ACHAT</th><th>LOCATION</th></tr></thead>";
  table_comparaison_duree += "<tr>";
  table_comparaison_duree += "<td>" + "Epargne" + "</td>";
  if (epargneMensuelle[rangeSlider.value - 1] > 0) {
    table_comparaison_duree +=
      "<td>" + Math.round(epargne[rangeSlider.value - 1]) + "</td>";
  } else {
    table_comparaison_duree +=
      "<td>" +
      Math.round(
        epargne[rangeSlider.value - 1] +
          epargneCumulAchat[rangeSlider.value - 1] / (12 * rangeSlider.value)
      ) +
      "</td>";
  }
  if (epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value > 0) {
    table_comparaison_duree +=
      "<td>" +
      Math.round(
        epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value
      ) +
      "</td>";
  } else {
    table_comparaison_duree += "<td>" + 0 + "</td>";
  }
  table_comparaison_duree += "</tr>";
  table_comparaison_duree += "<tr>";
  table_comparaison_duree += "<td>" + "Depense" + "</td>";
  table_comparaison_duree +=
    "<td>" + Math.round(depense[rangeSlider.value - 1]) + "</td>";
  table_comparaison_duree +=
    "<td>" +
    Math.round(loyerActualiseCumul[rangeSlider.value - 1] / rangeSlider.value) +
    "</td>";
  table_comparaison_duree += "</tr>";
  table_comparaison_duree += "</table>";

  document.getElementById(
    "comparaison_duree"
  ).innerHTML = table_comparaison_duree;

  rangeSlider.addEventListener("input", showSliderValue, false);

  function showSliderValue() {
    rangeBullet.innerHTML = rangeSlider.value;
    var bulletPosition = rangeSlider.value / rangeSlider.max;
    rangeBullet.style.left = bulletPosition * 578 + "px";
    document.getElementById("comparaison_duree").innerHTML = rangeSlider.value;

    var explication_bottom =
      "L'<strong>achat</strong> immobilier permet de rembourser tous les mois une part de capital par le paiement d'une mensualité : " +
      "<mark>" +
      Math.round(
        epargne[rangeSlider.value - 1] +
          epargneCumulAchat[rangeSlider.value - 1] / (12 * rangeSlider.value)
      ) + // attention, ajouter if / else !
      "€" +
      "</mark>" +
      "<br>" +
      "Ce remboursement de capital n'est pas gratuit, puisque l'achat induit des frais (notaire, agence, intérêts, assurance, entretien, charges, taxe foncière) : " +
      "<mark>" +
      Math.round(depense[rangeSlider.value - 1]) +
      "€" +
      "</mark>" +
      "<br>" +
      "<br>" +
      "De son côté, le <strong>locataire</strong> dépense tous les mois un loyer : " +
      "<mark>" +
      Math.round(
        loyerActualiseCumul[rangeSlider.value - 1] / rangeSlider.value
      ) +
      "€" +
      "</mark>" +
      "<br>";

    if (epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value > 0) {
      explication_bottom +=
        "Ce loyer est souvent inférieur au montant de la mensualité et des frais que le propriétaire paye lors d'un achat." +
        "<br>" +
        "Cette différence lui permet d'épargner tous les mois : " +
        "<mark>" +
        Math.round(
          epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value
        ) +
        "€" +
        "</mark>";
    } else {
      explication_bottom +=
        "Le loyer est souvent inférieur au montant de la mensualité et des frais que le propriétaire paye lors d'un achat." +
        "<br>" +
        "Sauf dans cette configuration où le locataire n'épargne pas mensuellement le différentiel.";
    }

    document.getElementById(
      "explication_bottom"
    ).innerHTML = explication_bottom;

    if (rangeSlider.value > years) {
      var table_comparaison_duree = "<table>";
      table_comparaison_duree +=
        "<thead><tr><th></th><th>ACHAT</th><th>LOCATION</th></tr></thead>";
      table_comparaison_duree += "<tr>";
      table_comparaison_duree += "<td>" + "Epargne" + "</td>";
      if (epargneMensuelle[rangeSlider.value - 1] > 0) {
        table_comparaison_duree += "<td>" + "X" + "</td>";
      } else {
        table_comparaison_duree += "<td>" + "X" + "</td>";
      }
      if (epargneMensuelle[rangeSlider.value - 1] > 0) {
        table_comparaison_duree += "<td>" + "X" + "</td>";
      } else {
        table_comparaison_duree += "<td>" + "X" + "</td>";
      }
      table_comparaison_duree += "</tr>";
      table_comparaison_duree += "<tr>";
      table_comparaison_duree += "<td>" + "Depense" + "</td>";
      table_comparaison_duree += "<td>" + "X" + "</td>";
      table_comparaison_duree += "<td>" + "X" + "</td>";
      table_comparaison_duree += "</tr>";
      table_comparaison_duree += "</table>";
    } else {
      var table_comparaison_duree = "<table>";
      table_comparaison_duree +=
        "<thead><tr><th></th><th>ACHAT</th><th>LOCATION</th></tr></thead>";
      table_comparaison_duree += "<tr>";
      table_comparaison_duree += "<td>" + "Epargne" + "</td>";
      if (epargneMensuelle[rangeSlider.value - 1] > 0) {
        table_comparaison_duree +=
          "<td>" + Math.round(epargne[rangeSlider.value - 1]) + "</td>";
      } else {
        table_comparaison_duree +=
          "<td>" +
          Math.round(
            epargne[rangeSlider.value - 1] +
              epargneCumulAchat[rangeSlider.value - 1] /
                (12 * rangeSlider.value)
          ) +
          "</td>";
      }
      if (
        epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value >
        0
      ) {
        table_comparaison_duree +=
          "<td>" +
          Math.round(
            epargneMensuelleCumul[rangeSlider.value - 1] / rangeSlider.value
          ) +
          "</td>";
      } else {
        table_comparaison_duree += "<td>" + 0 + "</td>";
      }
      table_comparaison_duree += "</tr>";
      table_comparaison_duree += "<tr>";
      table_comparaison_duree += "<td>" + "Depense" + "</td>";
      table_comparaison_duree +=
        "<td>" + Math.round(depense[rangeSlider.value - 1]) + "</td>";
      table_comparaison_duree +=
        "<td>" +
        Math.round(
          loyerActualiseCumul[rangeSlider.value - 1] / rangeSlider.value
        ) +
        "</td>";
      table_comparaison_duree += "</tr>";
      table_comparaison_duree += "</table>";
    }

    document.getElementById(
      "comparaison_duree"
    ).innerHTML = table_comparaison_duree;
  }
}

// https://www.devenir-rentier.fr/t15317

// mettre label form
