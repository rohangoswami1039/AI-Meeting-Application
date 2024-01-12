import React from 'react';
import './Style/Recents.css'

const RecentList = ({ items, selectedItem, onItemClick }) => {
    console.log(items)
    
    const formatTimestamp = (timestamp) => {
      if (!timestamp || !timestamp.seconds) {
        return 'Invalid Timestamp';
      }
    
      const date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
      date.setMinutes(date.getMinutes() + 330); // Adjust for UTC+5:30
    
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format
    
      return `${formattedHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    };

    return (
<div className="list_container">
      <div className="recent_items_list">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`recent_item ${selectedItem && (selectedItem.meetingNumber === item.meetingNumber) ? 'selected' : ''}`}
          >
            <div className="meeting_item">
              <div className="icon_container">
                            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.98388 25.431C6.18612 25.431 7.96617 23.6475 7.96617 21.4471C7.96617 19.2474 6.18612 17.4631 3.98388 17.4631C1.78349 17.4631 0 19.2474 0 21.4471C0 23.6475 1.78349 25.431 3.98388 25.431Z" fill="#0a6ebd"/>
                                <path d="M3.97985 26.7897C1.83774 26.7897 0.0893555 28.5264 0.0893555 30.6794V35.5159H4.69808L7.6718 29.4415C7.16218 27.8917 5.70657 26.7897 3.97985 26.7897Z" fill="#0a6ebd"/>
                                <path d="M10.5011 17.8143C12.4731 17.8143 14.0689 16.2177 14.0689 14.2449C14.0689 12.2755 12.4731 10.6765 10.5011 10.6765C8.53 10.6765 6.93262 12.2755 6.93262 14.2449C6.93262 16.2177 8.53008 17.8143 10.5011 17.8143Z" fill="#0a6ebd"/>
                                <path d="M7.00684 26.0824V26.8516H8.94041L12.4772 19.6436C11.9159 19.2482 11.2394 19.0305 10.5011 19.0305C10.0022 19.0305 9.52351 19.1339 9.09729 19.3216C9.36755 19.9772 9.52351 20.6937 9.52351 21.4436C9.52351 23.389 8.52502 25.0939 7.00684 26.0824Z" fill="#0a6ebd"/>
                                <path d="M21.0792 10.9033C23.0512 10.9033 24.6477 9.30673 24.6477 7.33394C24.6477 5.3645 23.0512 3.76544 21.0792 3.76544C19.1081 3.76544 17.5107 5.3645 17.5107 7.33394C17.5107 9.30673 19.1081 10.9033 21.0792 10.9033Z" fill="#0a6ebd"/>
                                <path d="M21.0792 12.1169C19.1523 12.1169 17.5874 13.6802 17.5874 15.6096V17.1235H24.571V15.6096C24.571 13.6802 23.0086 12.1169 21.0792 12.1169Z" fill="#0a6ebd"/>
                                <path d="M14.7937 18.4658L5.57959 37.2677V39.2347H37.4202V37.2677L28.2062 18.4658H14.7937Z" fill="#0a6ebd"/>
                                <path d="M39.016 25.431C41.2165 25.431 42.9999 23.6475 42.9999 21.4471C42.9999 19.2474 41.2165 17.4631 39.016 17.4631C36.8138 17.4631 35.0337 19.2475 35.0337 21.4471C35.0337 23.6475 36.8138 25.431 39.016 25.431Z" fill="#0a6ebd"/>
                                <path d="M39.0202 26.7897C37.2934 26.7897 35.8378 27.8917 35.3281 29.4415L38.3019 35.516H42.9107V30.6795C42.9107 28.5264 41.1623 26.7897 39.0202 26.7897Z" fill="#0a6ebd"/>
                                <path d="M32.4988 17.8143C34.47 17.8143 36.0674 16.2177 36.0674 14.2449C36.0674 12.2755 34.47 10.6765 32.4988 10.6765C30.5269 10.6765 28.9312 12.2755 28.9312 14.2449C28.9312 16.2177 30.5269 17.8143 32.4988 17.8143Z" fill="#0a6ebd"/>
                                <path d="M32.4985 19.0305C31.7604 19.0305 31.0839 19.2482 30.5225 19.6436L34.0593 26.8516H35.993V26.0824C34.4747 25.0939 33.4763 23.389 33.4763 21.4436C33.4763 20.6937 33.6322 19.9772 33.9025 19.3216C33.4762 19.1338 32.9974 19.0305 32.4985 19.0305Z" fill="#0a6ebd"/>
                            </svg>
                            </div>
              <div className='details_container'>
                <div className='meeting_Title'>{item.meetingTitle}</div>
                <div className='meeting_Title_dis'>{item.meetingDiscription}</div>                
                {selectedItem && selectedItem.meetingNumber === item.meetingNumber && (
                  <div className='extra_details'>
                    <div className='detail_row'>
                      <span className='label'>Joined Late:</span>
                      <span className='value'>{item.joined_late ? `Yes (${item.Late_time.hour} H:${item.Late_time.minutes} M)` : 'No'}</span>
                    </div>
                    <div className='detail_row'>
                      <span className='label'>Meeting Number:</span>
                      <span className='value'>{item.meetingNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
};

export default RecentList;

