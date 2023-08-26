import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Filza",
    image:
      "https://pps.whatsapp.net/v/t61.24694-24/353093881_988573675629965_2477169096061999772_n.jpg?ccb=11-4&oh=01_AdREWKdKJFouoB4HW_LirSEoMFAddPGqElPs_LuKIZgeTA&oe=64F71A0E&_nc_cat=105",
    balance: 0,
  },
  {
    id: 933374,
    name: "Sneha",
    image:
      "https://pps.whatsapp.net/v/t61.24694-24/361674506_2854167244717103_3432104432921395312_n.jpg?ccb=11-4&oh=01_AdQKl7iJ18ow_MGgetbfebQUMDgjoezemwJSRheMyf8dGg&oe=64F70A00&_nc_cat=106",
    balance: -10,
  },
  {
    id: 933372,
    name: "Rohit",
    image:
      "https://pps.whatsapp.net/v/t61.24694-24/357409416_994337081926240_559383608275765883_n.jpg?ccb=11-4&oh=01_AdSWFQCHn5ZrejHZTw470Qx0M6-vc-BFvIgucvHIQWIh4A&oe=64F729E5&_nc_cat=100",
    balance: 20,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selected, setSelected] = useState(null);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={selected}
          setSelected={setSelected}
        />
        {showAddFriend && (
          <FormAddFriend friends={friends} setFriends={setFriends} />
        )}
        <Button onClick={() => setShowAddFriend((show) => !show)}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selected && (
        <FormSplitBill
          selected={selected}
          setSelected={setSelected}
          friends={friends}
          setFriends={setFriends}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selected, setSelected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          selected={selected}
          friend={friend}
          setSelected={setSelected}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selected, setSelected }) {
  function handleSelected() {
    if (friend === selected) setSelected(null);
    else setSelected(friend);
  }
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance === 0 ? (
        <p>You and {friend.name} are even</p>
      ) : (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      <Button onClick={handleSelected}>Select</Button>
    </li>
  );
}

function FormAddFriend({ friends, setFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;
    const friend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    setFriends([...friends, friend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend">
      <label>🧑🏻‍🤝‍🧑🏻Friend Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <label>🌇Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />
      <Button onClick={handleAddFriend}>Add</Button>
    </form>
  );
}
function FormSplitBill({ selected, setSelected, friends, setFriends }) {
  const friend = selected;
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const [whosPaying, setWhosPaying] = useState("user");
  let friendExpense = billValue - yourExpense;
  function handleSplitBill(e) {
    e.preventDefault();
    setFriends(
      friends.map((friend) =>
        friend === selected
          ? {
              ...friend,
              balance: whosPaying === "user" ? friendExpense : -1 * yourExpense,
            }
          : friend
      )
    );
  }
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {friend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>🧍‍♂️Your expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />
      <label>🧑🏻‍🤝‍🧑🏻{friend.name}'s expense</label>
      <input type="number" disabled value={friendExpense} />
      <label>🤑Who is paying the bill</label>
      <select
        value={whosPaying}
        onChange={(e) => setWhosPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button onClick={handleSplitBill}>Split Bill</Button>
    </form>
  );
}
export default App;
