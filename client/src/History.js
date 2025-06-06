import React from "react";
import HistoryCard from "./HistoryCard";

export default function History({history, name}){
    const [addingCard, setAddingCard] = React.useState(false);
    const [cardForm, setCardForm] = React.useState({});

    const [cards, setCards] = React.useState(history)
    const [newId, setNewId] = React.useState(0);
    const [newCards, setNewCards] = React.useState([]) // New cards that were added

    const newCardsRef = React.useRef([])
    const newPositionsRef = React.useRef({})

    const [newPositions, setNewPositions] = React.useState({}) // ANY time a position changes

    React.useEffect(() => {
        setCards(prev => history)
        if(history.length > 0){
            setNewId(prev => history[history.length - 1].id + 1)
        }
    }, [history])
    React.useEffect(() => {
        newCardsRef.current = newCards
    }, [newCards])
    React.useEffect(() => {
        newPositionsRef.current = newPositions
    }, [newPositions])

    React.useEffect(() => {
        const saveCards = () => {
            //(newCardsRef.current.length > 0 || newPositionsRef.current.length > 0){
                navigator.sendBeacon("/add_cards", JSON.stringify(
                    {cards: newCardsRef.current, name: name, positions: newPositionsRef.current}
                ))
            //}
        }
        window.addEventListener("pagehide", saveCards)
        return () => window.removeEventListener("pagehide", saveCards)
    }, [])

    function addCard(formData) {
        const heading = formData.get('heading')
        const content = formData.get('content')

        console.log("New Id atp:")
        console.log(newId)
        console.log(history.length)
        console.log(history)
        setCards(prev => [...prev, {id: newId, heading: heading, content: content}])
        setNewCards(prev => [...prev, {id: newId, heading: heading, content: content}])
        setNewId(prevId => prevId + 1)
        setAddingCard(prev => false)
    }

    function handleDrag(id, x, y) {
        console.log("Calling handle drag")
        setNewPositions(prev => ({...prev, [id]: x + " " + y}))
        console.log(newPositions)
    }

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
            {cards.map((card) => (
                //<HistoryCard id={card.id} heading={card.heading} content={card.content} onDragHandler = {handleDrag} />
                <HistoryCard {...card} onDragHandler = {handleDrag} />
            ))}
            {addingCard? 
                <div className="add-card-wrapper">
                    <form action={addCard}>
                        <div className="history--card mb-0">
                                <div className="heading add-heading">
                                    <input type="text" id="heading" name="heading" placeholder="Heading" value={cardForm.heading} />
                                </div>
                                <textarea id="content" name="content" rows="4" cols="50">
                                    {cardForm.content}
                                </textarea>
                        </div>
                        <button type="submit" className="submit-btn mt-0">Submit</button>
                    </form>
                </div>
                :
                <div id="add-history-card" className="history--card" onClick = {() => setAddingCard(prev => true)}>
                    <div className="heading add-heading">Add Card</div>
                    <img
                        src={"https://cdn-icons-png.flaticon.com/512/8212/8212741.png"}
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            }
        </div>
    )
}