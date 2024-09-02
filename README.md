# Анализ и визуализация данных о Covid-19
Данный проект является веб-приложением для анализа и визуализации данных о Covid-19. Оно предоставляет пользователю функционал для удобной работы с данными: возможность визуализировать статистику в виде графиков, фильтровать данные по различным критериям, а также создавать, обновлять и удалять записи в виде таблицы на фронтенде.
## Исходные данные 
За основу был взят готовый Dataset [COVID-19 Dataset](https://skillbox.ru/media/](https://www.kaggle.com/datasets/imdevskp/corona-virus-report "Ковид").  
Язык программирования для Backend: **Python**  
Язык программирования для Frontend: **JavaScript**  
Для Api использовались **FastApi** и **React**  
Для анализа данных использовались библиотеки **pandas**, **numpy**, **matplotlib**, **seaborn** и **plotly**  
База данных: **PostgreSql**  
Библиотека для работы с БД: **alembic**  
## Пример анализа и визуализации данных  
Фильтрация данных по России:  
![image](https://github.com/user-attachments/assets/fcac491b-5cd6-40e5-85f5-3ca73e4b50a5)  
Визуализация данных о заболеваемости по РФ в разрезе даты:  
![image](https://github.com/user-attachments/assets/60e5b778-bd46-4e36-99cf-7225d8e1140d)
Суммирование данных о заболеваемости по дням:  
![image](https://github.com/user-attachments/assets/1b8a8753-5c5e-4bc7-96df-f257fcb8291b)  
График роста заболеваемости Covid-19:  
![image](https://github.com/user-attachments/assets/53c9d0df-031a-459e-877c-56b59594dd05)  
Раздельный график:  
![image](https://github.com/user-attachments/assets/53049f8a-2b81-4288-87a0-fc995d8bb9db)
Детальный график по всем странам:  
![image](https://github.com/user-attachments/assets/2159af69-154c-4a6b-965a-4f26a57c9f86)  
Классификация методом опорных векторов с отображения полноты, точности и долей правильных ответов    
![image](https://github.com/user-attachments/assets/774fbdb2-882a-4706-8c3e-518bc4ac95df)  
Матрица ошибок  
![image](https://github.com/user-attachments/assets/52386020-c42d-4664-8e91-5b8d30b344c0)

## Пример работы Web части  
Главная страница. Для вывода данных реализована пагинация, а так же фильтрация данных. Фильтры поддерживают формат "c" и "по" для числовых и datetime значений. Записи можно создавать, обновлять, удалять, а так же испортировать из CSV файла  
![image](https://github.com/user-attachments/assets/80c7164f-1bf0-48dd-8122-c054ba05586a)  
Пример импорта CSV файла. Ошибочные записи добавляются в список ошибочных, успешные - загружаются в БД  
![image](https://github.com/user-attachments/assets/54b3fe0b-3922-48af-8147-29ca4e8a22f4)
Пример работы фильтров  
![image](https://github.com/user-attachments/assets/57dc020d-8bd0-4d3e-a64e-f264b790c59d)  
Пример модального окна для обновления записей:  
![image](https://github.com/user-attachments/assets/40477587-b636-46ec-a630-c824e3b6cf64)  

## Структура БД
В качестве СУБД был выбран PostgreSql, как наиболее популярное решение в текущих реалиях. Для удобной работы с БД, а так же последующей возможности для масштабируемости использована библиотека **alembic**. Реализовано несколько миграций  
![image](https://github.com/user-attachments/assets/e7875c08-1973-4e2f-aca2-2ebf0252b689)  
ER диаграмма БД  
![image](https://github.com/user-attachments/assets/40edb07b-1ba4-45ac-94b8-1b361a459872)  

## Структура проекта  







