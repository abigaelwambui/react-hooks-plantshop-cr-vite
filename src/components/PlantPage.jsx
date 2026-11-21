
import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
    const [plants, setPlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:6001/plants")
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((data) => {
                console.log("Fetched plants:", data);
                setPlants(data);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    function handleAddPlant(newPlant) {
        fetch("http://localhost:6001/plants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPlant),
        })
            .then((response) => response.json())
            .then((addedPlant) => {
                setPlants((currentPlants) => [...currentPlants, addedPlant]);
            });
    }

    function handleSoldOut(plantId) {
        setPlants((currentPlants) =>
            currentPlants.map((plant) =>
                plant.id === plantId
                    ? { ...plant, inStock: false }
                    : plant
            )
        );
    }

    const filteredPlants = plants.filter((plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main>
            <NewPlantForm onAddPlant={handleAddPlant} />
            <Search
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <PlantList
                plants={filteredPlants}
                onSoldOut={handleSoldOut}
            />
        </main>
    );
}

export default PlantPage;
