import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';

function AddPlat({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [documentId, setDocumentId] = useState('');
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesList = [];
                const querySnapshot = await firestore().collection('categories').get();
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data();
                    if (data && data.title) {
                        categoriesList.push({
                            label: data.title,
                            value: documentSnapshot.id,
                        });
                    } else {
                        console.error('Document data or title field is undefined:', documentSnapshot.id);
                    }
                });
                setCategories(categoriesList);
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        try {
            const platData = {
                title: title,
                description: description,
                price: price,
                imageURL: imageURL,
                categoryId: categoryId,
                document_id: documentId,
            };
            const response = await axios.post('http://192.168.192.1:8080/plats/create', platData);

            if (response.status === 200) {
                console.log('Plat ajouté avec succès');
                setTitle('');
                setDescription('');
                setPrice('');
                setImageURL('');
                setCategoryId(null);
                setDocumentId('');
            } else {
                console.error('Erreur lors de l\'ajout du plat');
            }
        } catch (error) {
            console.error('Erreur lors de la requête vers le backend:', error);
            Alert.alert('Erreur', 'Erreur lors de la requête vers le backend');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nom du plat"
                placeholderTextColor="gray"
                onChangeText={text => setTitle(text)}
                value={title}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="gray"
                onChangeText={text => setDescription(text)}
                value={description}
            />
            <TextInput
                style={styles.input}
                placeholder="Prix"
                placeholderTextColor="gray"
                onChangeText={text => setPrice(text)}
                value={price}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="URL de l'image"
                placeholderTextColor="gray"
                onChangeText={text => setImageURL(text)}
                value={imageURL}
            />
            <DropDownPicker
                open={open}
                value={categoryId}
                items={categories}
                setOpen={setOpen}
                setValue={setCategoryId}
                setItems={setCategories}
                placeholder="Sélectionner une catégorie"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />
            <TextInput
                style={styles.input}
                placeholder="Document ID"
                placeholderTextColor="gray"
                onChangeText={text => setDocumentId(text)}
                value={documentId}
            />

            <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'black',
    },
    dropdown: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    dropdownContainer: {
        borderColor: 'gray',
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddPlat;
