import {View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert,} from 'react-native';
import React, {useState, useEffect,} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';


export default function App() {
  const intialState = {
    id:0,
    title: "",
    description: "",
    completed: false,
  }
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(intialState)
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem("todos"); 
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };
  useEffect(() => {
    getTodos()
  }, []);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Please enter the todo's");
      return;
    }
    

    newTodo.id = todo.length + 1;

    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todos", JSON.stringify(updatedTodo)); 
    setShowModal(false);

    setNewTodo(intialState);
  };

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingItems = todo.filter(todoItem => todoItem.id !== item.id)
    const updatedTodo = [ ...itemToBeUpdated, ...remainingItems];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
  }

  const deleteTodo = (item) => {
    const updatedTodo = todo.filter(todoItem => todoItem.id !== item.id);
    setTodo(updatedTodo);
    AsyncStorage.setItem('todos', JSON.stringify(updatedTodo));
  };

  const displayTodo = (item) => (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          `${item.title}`,
          `${item.description}`,
          [
            {
              text: item.completed ? "Mark in progress" : "Mark completed",
              onPress: () => updateTodo(item),
            },
            {
              text: "Delete",
              onPress: () => deleteTodo(item),
              style: "destructive", 
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true }
        )
      }
      style={{
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingHorizontal: 20
      }}
    >
      <BouncyCheckbox
        isChecked={item.completed ? true : false}
        fillColor='blue'
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: "black",
          fontSize: 16,
          width: "90%",
          textDecorationLine: item.completed ? "line-through" : "none"
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const handleChange = (title,value) => setNewTodo({...newTodo, [title]: value})

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 20,
        }}>
        <View>
          <Text style={{color: 'black', fontSize: 28, fontWeight: 'bold'}}>
            Todoz is Here for you 👋{' '}
          </Text>
          <Text style={{color: 'black', fontSize: 16}}>
          {todo.length} {todo.length == 1 ? 'task' : 'tasks'} is remaining for you
          </Text>
        </View>
      </View>
      <Text style={{paddingHorizontal: 20, color: 'black', fontSize: 20}}>
        To do 📝
      </Text>
      <ScrollView>
        <View style={{height: 250}}>
          {
            todo.map(item => !item.completed? displayTodo(item) : null)
          }
        </View>
      </ScrollView>
      <Text
        style={{
          paddingHorizontal: 20,
          color: 'black',
          fontSize: 22,
          fontWeight: 'bold',
        }}>
        Completed ✔️
      </Text>
      <ScrollView>
        <View style={{height: 250}}>
        {
          todo.map(item => item.completed? displayTodo(item) : null)
        }
        </View>
      </ScrollView>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'lightblue',
            borderRadius: 100,
            width: 60,
            height: 60,
            
          }}>
          <Text style={{fontSize: 30, fontWeight: 'bold'}}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={{marginHorizontal: 20}}>
          <View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20,
            }}>
            <View>
              <Text style={{color: 'black', fontSize: 28, fontWeight: 'bold'}}>
                Todoz is Here for you 👋
              </Text>
              <Text style={{color: 'black', fontSize: 16}}>
                {todo.length} {todo.length == 1 ? 'task' : 'tasks'} is remaining for you 
              </Text>
            </View>
          </View>
          <Text style={{marginVertical: 10,marginHorizontal: 10, color: '#000',fontWeight: 'bold', fontSize: 22}}>Add a Todo Item</Text>

          <TextInput placeholder='Title' value={newTodo.title} onChangeText={(title) => handleChange('title', title)} style={{ backgroundColor:"rgb(220, 220, 220)", borderRadius: 10, paddingHorizontal: 10, marginVertical: 10, color:'black' }}/>

          <TextInput placeholder='Description' value={newTodo.description} onChangeText={(desc) => handleChange('description', desc)} style={{ backgroundColor:"rgb(220, 220, 220)", borderRadius: 10, paddingHorizontal: 10, marginVertical: 10, color:'black' }} multiline={true} numberOfLines={6}/>

          <View style={{width:'100%', alignItems:'center'}}> 
            <TouchableOpacity onPress={addTodo} style={{backgroundColor:"blue", width: 100, borderRadius: 10, alignItems: 'center', padding:10}}>
              <Text style={{ color:'white', fontSize:22}}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
