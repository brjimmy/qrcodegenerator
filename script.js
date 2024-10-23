// Initialize QRCodeStyling instance for the preview
const qrCode = new QRCodeStyling({
    width: 200, // QR code size for all formats
    height: 200,
    type: "svg",
    data: "",
    dotsOptions: { color: "#000", type: "square" },
    backgroundOptions: { color: "transparent" },
    imageOptions: { crossOrigin: "anonymous", margin: 0 },
});

// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const qrText = document.getElementById("qrText");
const qrPreview = document.getElementById("qrPreview");
const downloadButtons = document.querySelectorAll(".download-btn");

// Display a dummy QR code on page load with 25% opacity
window.addEventListener("DOMContentLoaded", () => {
    qrCode.update({ data: "Dummy QR Code" });
    qrPreview.style.opacity = "0.25"; // Set preview opacity
    qrCode.append(qrPreview); // Append dummy QR code to preview
});

// Generate QR code on button click
generateBtn.addEventListener("click", () => {
    const text = qrText.value.trim();

    if (text) {
        qrCode.update({ data: text }); // Update with input data
        qrPreview.innerHTML = ""; // Clear previous content
        qrPreview.style.opacity = "1"; // Reset opacity
        qrCode.append(qrPreview); // Display the new QR code
    } else {
        alert("Please enter some text or URL!");
    }
});

// Handle download logic for PNG, JPG, and SVG
downloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const format = button.getAttribute("data-format");

        if (format === "svg") {
            // Directly retrieve the raw SVG data and download it
            qrCode.getRawData("svg").then((svgData) => {
                const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `qr_code.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url); // Clean up
            }).catch((error) => {
                console.error("Error generating SVG:", error);
                alert("Failed to generate the SVG file. Please try again.");
            });
        } else {
            // Handle PNG and JPG downloads as before
            qrCode.getRawData("svg").then((svgData) => {
                const img = new Image();
                const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = 540;
                    canvas.height = 540;

                    context.fillStyle = format === "jpg" ? "#ffffff" : "rgba(0, 0, 0, 0)";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 20, 20, 500, 500);

                    canvas.toBlob((blob) => {
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `qr_code.${format}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(link.href);
                    }, `image/${format}`);

                    URL.revokeObjectURL(url);
                };

                img.onerror = () => {
                    alert("Failed to load the QR code image.");
                };

                img.src = url;
            });
        }
    });
});
