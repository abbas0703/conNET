import React, { useState, useEffect } from 'react';
import './FriendsList.css';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost/HT/backend/get_friends.php')
      .then(response => response.json())
      .then(data => setFriends(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filteredFriends = friends.filter(friend => {
    return friend.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='root'>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search friends"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className='search-input'
        />
      </div>
      <h1 className='h1'>Friends</h1>
      <div className='container'>
        <div className='cards'>
          {filteredFriends.map(friend => (
            <div className='card' key={friend.id}>
              <div className={`status ${friend.online ? 'online' : 'offline'}`}></div>
              <span className='icon'><span className='icon'>{friend.gender === 'male' ? '🙍‍♂️' : '🙍‍♀️'}</span></span>
              <span className='name'>{friend.name}</span>
              <a href={`https://github.com/${friend.github}`} className='github-link'>GitHub</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
