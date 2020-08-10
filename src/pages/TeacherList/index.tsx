import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons'
import styles from './styles';
import PageHeader from '../../Components/PageHeader';
import TeacherItem, {Teacher} from '../../Components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [weekDay, setWeekDay] = useState('');
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then( response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map( teacher => {
          return teacher.id;
        })
        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  function handleFiltersSubmit() {

    api.get('classes', {
      params: {
        week_day: weekDay,
        time,
        subject,
      }
    }).then(response => {
      setIsFiltersVisible(false);
      setTeachers(response.data);
      loadFavorites();
    });
  }

  return (<View style={styles.container}>
    <PageHeader 
        title="Proffys disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name='filter' size={20} color="#FFF" />
          </BorderlessButton>
        )}>
      { isFiltersVisible && 
        (<View style={styles.searchForm}>
        <Text style={styles.label}>Matérias</Text>
        <TextInput
          style={styles.input}
          placeholder="Qual a matéria"
          placeholderTextColor='#c1bccc'
          value={subject}
          onChangeText={ text => setSubject(text)}
        />

        <View style={styles.inputGroup}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Dia da semana</Text>
            <TextInput
              style={styles.input}
              placeholder='Qual o dia'
              placeholderTextColor='#c1bccc'
              value={weekDay}
              onChangeText={ text => setWeekDay(text)}
            />
          </View>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder='Qual horário'
              placeholderTextColor='#c1bccc'
              value={time}
              onChangeText={ text => setTime(text)}
            />
          </View>
        </View>
        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
          <Text style={styles.submitButtonText}>Filtrar</Text>
        </RectButton>
      </View>)
      }
    </PageHeader>
    <ScrollView
      style={styles.teacherList}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
       { teachers.map((teacher: Teacher) => {
         return  (
          <TeacherItem 
            key={teacher.id} 
            teacher={teacher}
            favorited={favorites.includes(teacher.id)}
          />);
       })}
      
    </ScrollView>
  </View>)
}

export default TeacherList;