import styles from "./styles/CardContainer.module.css";
import { Card, CardAction, CardDescription, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export default function CardContainer() {
  return (
    <div className={styles.cardContainer}>
        <div className={styles.cardContainerHeader}>
            <h1>Recent Decks</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    </div>
  );
}