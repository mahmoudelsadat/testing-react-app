import { render, screen } from "@testing-library/react";
import Status from "./Status";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { server } from "../../mocks/server";
import HeroesFromAPI from "./Heroes";
import { http, HttpResponse } from "msw";


describe("Status component", () => {
  test('should render "🔴 Offline" and the toggle button on initial render', () => {
    render(<Status></Status>)
    let paragraph = screen.queryByRole("paragraph")
    expect(paragraph).toHaveTextContent("🔴 Offline")
    let TglBtn = screen.queryByRole("button")
    expect(TglBtn).toBeInTheDocument()
  });

  test('should switch to "🟢 Online" when button is clicked once', async() => {
    render(<Status></Status>)
    let paragraph = screen.queryByRole("paragraph")
    let TglBtn = screen.queryByRole("button")
    let user = userEvent.setup();
    await user.click(TglBtn);
    expect(paragraph).toHaveTextContent("🟢 Online")

    
  });

  test('should switch back to "🔴 Offline" when button is clicked twice',async () => {
    render(<Status></Status>)
    let paragraph = screen.queryByRole("paragraph")
    let TglBtn = screen.queryByRole("button")
    let user = userEvent.setup();
    await user.click(TglBtn);
    await user.click(TglBtn);
    
    expect(paragraph).toHaveTextContent("🔴 Offline")

    
  });
});
describe("HeroesFromAPI component", () => {
  
    beforeAll(()=>{
        server.listen()
    })
    afterAll(()=>{
        server.close()
    })
  test('should display "No heroes available" when API returns an empty list', async() => {
    server.use(
      http.get("http://localhost:3000/heroes", () => {
        return HttpResponse.json([], { status: 200 });
      })
    );

    render(<HeroesFromAPI />);

    const message = await screen.findByText(/No heroes available/i);
    expect(message).toBeInTheDocument();
  });

  test("should render a list of heroes after successful API fetch", async() => {
   const mockHeroes = [
      { id: 1, name: "Batman", strength: 15 },
      { id: 2, name: "Superman", strength: 25 },
    ];

    
    server.use(
      http.get("http://localhost:3000/heroes", () => {
        return HttpResponse.json(mockHeroes, { status: 200 });
      })
    );

    render(<HeroesFromAPI />);

    
    
    const batmanElement = await screen.findByText(/Batman: power=15 \(strong\)/i);
    expect(batmanElement).toBeInTheDocument();

    const supermanElement = await screen.findByText(/Superman: power=25 \(unbelievable\)/i);
    expect(supermanElement).toBeInTheDocument();

    
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  test("BONUS: should display an error message when API request fails with status 500", async() => {
    
    server.use(
      http.get("http://localhost:3000/heroes", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<HeroesFromAPI />);

    
    const heading = await screen.findByRole("heading");
    expect(heading).toHaveTextContent("Failed to fetch heroes");
  });
  });



